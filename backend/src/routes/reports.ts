import { Router, Response } from 'express';
import { z } from 'zod';
import rateLimit from 'express-rate-limit';
import { logger } from '@/utils/logger';
import { DatabaseService } from '@/services/DatabaseService';
import { ZKProofService } from '@/services/ZKProofService';
import { BlockchainService } from '@/services/BlockchainService';
import { RedisService } from '@/services/RedisService';
import { authMiddleware, optionalAuth, AuthenticatedRequest } from '@/middleware/auth';

const router = Router();

// ─── Rate limits ──────────────────────────────────────────────────────────────

/**
 * Tighter limit on report submission — heavier operation, abuse vector.
 *
 * M-3 NOTE — Tor / shared-IP compatibility:
 * IP-based rate limiting blocks all users sharing an exit node (Tor, VPNs, NAT).
 * This is a deliberate trade-off for an MVP:
 *   • Tor users can still submit via the sponsored path if they accept the relayer trust model.
 *   • A future mitigation is a PoW challenge (e.g. hashcash) or anonymous token scheme
 *     (e.g. Privacy Pass) issued before submission so the rate limit can be per-token
 *     rather than per-IP. Implement before promoting Tor as a supported access method.
 */
const submitLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: { error: 'Too many report submissions from this IP. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false
});

// ─── Validation schema ────────────────────────────────────────────────────────

const VALID_CATEGORIES = [
  'corruption', 'fraud', 'misconduct', 'safety_violation',
  'environmental', 'human_rights', 'financial_crime', 'other'
] as const;

const VALID_SEVERITIES = ['low', 'medium', 'high', 'critical'] as const;

// 65 536 bytes ≈ 64 KiB — generous for any real 5 000-char report after AES-GCM overhead.
const MAX_ENCRYPTED_CONTENT_BYTES = 65_536;

const submitReportSchema = z.object({
  encryptedContent: z.string().min(1, 'Encrypted content is required').max(MAX_ENCRYPTED_CONTENT_BYTES, 'Encrypted content exceeds maximum size.'),
  reportHash:       z.string().min(1, 'Report hash is required'),
  nullifierHash:    z.string(),
  proof:            z.record(z.unknown()).nullable(),
  publicSignals:    z.array(z.string()),
  category:         z.enum(VALID_CATEGORIES),
  severity:         z.enum(VALID_SEVERITIES),
  location:         z.string().max(200).optional(),
  isAnonymous:      z.boolean(),
  isSponsored:      z.boolean()
});

type SubmitReportBody = z.infer<typeof submitReportSchema>;

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Redis key for nullifier deduplication. */
function nullifierKey(hash: string): string {
  return `nullifier:${hash}`;
}

// ─── POST /api/v1/reports — Submit a report ───────────────────────────────────

router.post('/', submitLimiter, optionalAuth, async (req: AuthenticatedRequest, res: Response) => {
  // 1. Validate payload
  const parseResult = submitReportSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      error: 'Invalid request payload',
      details: parseResult.error.flatten().fieldErrors
    });
  }

  const body: SubmitReportBody = parseResult.data;

  try {
    const db = DatabaseService.getConnection();

    // 2. Nullifier deduplication — prevents the same identity submitting the same report twice.
    //    Checked in Redis (fast) first, then DB as fallback.
    if (body.isAnonymous && body.nullifierHash) {
      // Redis check (non-fatal if Redis is unavailable)
      try {
        const redisClient = RedisService.getInstance().getClient();
        const alreadySeen = await redisClient.get(nullifierKey(body.nullifierHash));
        if (alreadySeen) {
          return res.status(409).json({ error: 'A report with this nullifier hash already exists.' });
        }
      } catch {
        // Redis unavailable — fall through to DB check.
      }

      // DB check (authoritative)
      const existing = await db('reports')
        .where('reporter_hash', body.nullifierHash)
        .first();
      if (existing) {
        return res.status(409).json({ error: 'A report with this nullifier hash already exists.' });
      }
    }

    // 3. ZK proof verification (only for wallet-signed anonymous reports with a proof).
    //    ZK_PROOF_REQUIRED=true → verification errors are fatal (production mode).
    //    ZK_PROOF_REQUIRED unset/false → degrade gracefully while circuit is being set up.
    const zkProofRequired = process.env.ZK_PROOF_REQUIRED === 'true';

    if (body.isAnonymous && !body.isSponsored && body.proof && body.publicSignals.length > 0) {
      const zkService = ZKProofService.getInstance();

      if (!zkService.validateProofStructure(body.proof)) {
        logger.warn('Malformed ZK proof structure received — rejecting submission');
        return res.status(400).json({ error: 'Malformed ZK proof structure.' });
      }

      try {
        const isValid = await zkService.verifyReportProof(body.proof, body.publicSignals);
        if (!isValid) {
          logger.warn('Invalid ZK proof received — rejecting submission');
          return res.status(400).json({ error: 'ZK proof verification failed. Submission rejected.' });
        }
        logger.info('ZK proof verified successfully');
      } catch (verifyErr: any) {
        if (zkProofRequired) {
          // Production: circuit artifacts must be present. Fail hard.
          logger.error('ZK proof verification failed in required mode:', verifyErr.message);
          return res.status(500).json({ error: 'Proof verification service unavailable. Submission rejected.' });
        }
        // Development/setup: log and continue.
        logger.warn('ZK proof verification skipped (ZK_PROOF_REQUIRED not set):', verifyErr.message);
      }
    } else if (body.isAnonymous && !body.isSponsored && zkProofRequired) {
      // In production, anonymous non-sponsored reports must include a proof.
      return res.status(400).json({ error: 'ZK proof is required for anonymous submissions.' });
    }

    // 4. Persist to database.
    //    Sensitive content is stored only as encrypted_content.
    //    title and description are placeholder text — real content is in encrypted_content.
    const anonymousId = body.isAnonymous
      ? (body.publicSignals[0] || `anon_${Date.now()}`)
      : null;

    const [report] = await db('reports').insert({
      // Identity / privacy
      reporter_id:      req.user?.id ?? null,
      anonymous_id:     anonymousId,
      reporter_hash:    body.isAnonymous ? body.nullifierHash : null,
      is_anonymous:     body.isAnonymous,

      // Content — real content is AES-encrypted; title/description are placeholders.
      title:             body.isAnonymous ? 'Anonymous Report' : 'Report',
      description:       'Encrypted — see encrypted_content field.',
      encrypted_content: body.encryptedContent,

      // Classification
      category:          body.category,
      severity:          body.severity,
      city:              body.location ?? null,

      // ZK proof
      zk_proof: body.proof
        ? JSON.stringify({ proof: body.proof, publicSignals: body.publicSignals })
        : null,

      // Blockchain — the client submits on-chain directly for wallet submissions.
      // blockchain_tx_hash and ipfs_hash are filled in later via PATCH once confirmed.
      is_on_chain:      false,

      // Workflow
      status:   'submitted',
      priority: body.severity === 'critical' ? 'urgent'
               : body.severity === 'high'    ? 'high'
               : 'normal',

      // Sponsorship flag — relayer picks this up
      // Stored in analytics_data until a dedicated column is added.
      analytics_data: JSON.stringify({ isSponsored: body.isSponsored }),

      created_at:      db.fn.now(),
      updated_at:      db.fn.now(),
      last_updated_at: db.fn.now()
    }).returning('id');

    const reportId: string = typeof report === 'object' ? report.id : report;

    // 5. Cache nullifier in Redis (30-day TTL matches max report review window).
    if (body.isAnonymous && body.nullifierHash) {
      try {
        const redisClient = RedisService.getInstance().getClient();
        await redisClient.set(nullifierKey(body.nullifierHash), reportId, { EX: 60 * 60 * 24 * 30 });
      } catch (redisErr) {
        // Non-fatal — DB check is authoritative.
        logger.warn('Failed to cache nullifier in Redis:', redisErr);
      }
    }

    logger.info(`Report submitted successfully: ${reportId} (anonymous=${body.isAnonymous}, sponsored=${body.isSponsored})`);

    return res.status(201).json({
      reportId,
      status: 'submitted',
      isAnonymous:  body.isAnonymous,
      isSponsored:  body.isSponsored,
      message: body.isSponsored
        ? 'Report queued for sponsored blockchain submission.'
        : 'Report submitted. If you paid gas directly, the on-chain record is already being confirmed.'
    });

  } catch (err: any) {
    logger.error('Failed to submit report:', err);
    return res.status(500).json({ error: 'Failed to submit report. Please try again.' });
  }
});

// ─── GET /api/v1/reports/:id/status — Public status check by report ID ────────

router.get('/:id/status', async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  // Basic UUID format check to avoid unnecessary DB queries.
  const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!UUID_RE.test(id!)) {
    return res.status(400).json({ error: 'Invalid report ID format.' });
  }

  try {
    const db = DatabaseService.getConnection();
    const report = await db('reports')
      .select('id', 'status', 'category', 'severity', 'is_on_chain', 'blockchain_tx_hash', 'created_at', 'last_updated_at')
      .where({ id })
      .whereNull('deleted_at')
      .first();

    if (!report) {
      return res.status(404).json({ error: 'Report not found.' });
    }

    return res.json({
      reportId:       report.id,
      status:         report.status,
      category:       report.category,
      severity:       report.severity,
      isOnChain:      report.is_on_chain,
      txHash:         report.blockchain_tx_hash ?? null,
      submittedAt:    report.created_at,
      lastUpdatedAt:  report.last_updated_at
    });

  } catch (err: any) {
    logger.error('Failed to get report status:', err);
    return res.status(500).json({ error: 'Failed to retrieve report status.' });
  }
});

// ─── GET /api/v1/reports — List authenticated user's own reports ───────────────

router.get('/', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user?.id) {
    return res.status(401).json({ error: 'Authentication required.' });
  }

  try {
    const db = DatabaseService.getConnection();
    const page  = Math.max(1, parseInt(req.query.page  as string || '1',  10));
    const limit = Math.min(50, parseInt(req.query.limit as string || '20', 10));
    const offset = (page - 1) * limit;

    const [reports, countResult] = await Promise.all([
      db('reports')
        .select('id', 'status', 'category', 'severity', 'is_on_chain', 'blockchain_tx_hash', 'created_at', 'last_updated_at', 'votes_for', 'votes_against')
        .where({ reporter_id: req.user.id })
        .whereNull('deleted_at')
        .orderBy('created_at', 'desc')
        .limit(limit)
        .offset(offset),
      db('reports')
        .count('id as count')
        .where({ reporter_id: req.user.id })
        .whereNull('deleted_at')
    ]);

    const count = (countResult as any)[0]?.count ?? 0;

    return res.json({
      reports,
      pagination: {
        page,
        limit,
        total:      parseInt(count as string, 10),
        totalPages: Math.ceil(parseInt(count as string, 10) / limit)
      }
    });

  } catch (err: any) {
    logger.error('Failed to list reports:', err);
    return res.status(500).json({ error: 'Failed to retrieve reports.' });
  }
});

// ─── PATCH /api/v1/reports/:id/confirm — Mark on-chain after tx confirmation ──
// Verifies the tx against the blockchain before trusting it.
// Identified users: ownership via JWT. Anonymous users: no update via this endpoint —
// on-chain confirmation for anonymous reports is reconciled by the backend relayer/cron.

router.patch('/:id/confirm', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { txHash, blockNumber } = req.body;

  if (!txHash || typeof txHash !== 'string') {
    return res.status(400).json({ error: 'txHash is required.' });
  }

  const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!UUID_RE.test(id!)) {
    return res.status(400).json({ error: 'Invalid report ID format.' });
  }

  if (!/^0x[0-9a-fA-F]{64}$/.test(txHash)) {
    return res.status(400).json({ error: 'Invalid transaction hash format.' });
  }

  try {
    const db = DatabaseService.getConnection();

    // Verify the report belongs to this authenticated user
    const report = await db('reports')
      .where({ id, reporter_id: req.user!.id })
      .whereNull('deleted_at')
      .where('is_on_chain', false)
      .first();

    if (!report) {
      return res.status(404).json({ error: 'Report not found, already confirmed, or not yours.' });
    }

    // Verify the tx actually exists on-chain before trusting the caller-supplied hash.
    // Falls back gracefully if the blockchain node is unreachable.
    try {
      const receipt = await BlockchainService.getInstance().getTransactionReceipt(txHash);
      if (!receipt) {
        return res.status(400).json({ error: 'Transaction not found on-chain. It may still be pending.' });
      }
      if (!receipt.status) {
        return res.status(400).json({ error: 'Transaction was reverted on-chain.' });
      }
    } catch (chainErr: any) {
      // Blockchain node unreachable — log and allow optimistic update, but flag it.
      logger.warn(`Could not verify tx ${txHash} on-chain: ${chainErr.message}. Proceeding optimistically.`);
    }

    await db('reports')
      .where({ id })
      .update({
        blockchain_tx_hash: txHash,
        block_number:       blockNumber ?? null,
        is_on_chain:        true,
        last_updated_at:    db.fn.now(),
        updated_at:         db.fn.now()
      });

    logger.info(`Report ${id} confirmed on-chain: ${txHash} by user ${req.user!.id}`);
    return res.json({ reportId: id, isOnChain: true, txHash });

  } catch (err: any) {
    logger.error('Failed to confirm report on-chain:', err);
    return res.status(500).json({ error: 'Failed to confirm report.' });
  }
});

export default router;
