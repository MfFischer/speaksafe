import { Router, Response } from 'express';
import { z } from 'zod';
import { logger } from '@/utils/logger';
import { DatabaseService } from '@/services/DatabaseService';
import { BlockchainService } from '@/services/BlockchainService';
import { authMiddleware, optionalAuth, requireRole, AuthenticatedRequest } from '@/middleware/auth';

const router = Router();

// ─── Schemas ──────────────────────────────────────────────────────────────────

const voteSchema = z.object({
  decision:       z.enum(['for', 'against', 'abstain']),
  voteType:       z.enum(['approve', 'reject', 'escalate', 'investigate']),
  reason:         z.string().max(1000).optional(),
  walletAddress:  z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid wallet address'),
  transactionHash: z.string().regex(/^0x[0-9a-fA-F]{64}$/, 'Invalid transaction hash').optional()
});

// ─── GET /dao/stats — Public platform DAO statistics ─────────────────────────

router.get('/stats', optionalAuth, async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const db = DatabaseService.getConnection();

    const [reportStats, voteStats, donationStats] = await Promise.all([
      db('reports')
        .select(
          db.raw('COUNT(*) as total_reports'),
          db.raw("COUNT(*) FILTER (WHERE status = 'resolved') as resolved_reports"),
          db.raw("COUNT(*) FILTER (WHERE status = 'escalated') as escalated_reports"),
          db.raw("COUNT(*) FILTER (WHERE is_on_chain = true) as on_chain_reports")
        )
        .whereNull('deleted_at')
        .first(),

      db('dao_votes')
        .select(
          db.raw('COUNT(*) as total_votes'),
          db.raw('COUNT(DISTINCT voter_address) as unique_voters')
        )
        .first(),

      db('donations')
        .select(
          db.raw("SUM(amount) FILTER (WHERE status = 'confirmed' OR status = 'processed') as total_donated"),
          db.raw("COUNT(*) FILTER (WHERE status = 'confirmed' OR status = 'processed') as total_donations")
        )
        .first()
    ]);

    // Try to get live on-chain stats — fall back gracefully if contracts not deployed.
    let onChainStats = null;
    try {
      onChainStats = await BlockchainService.getInstance().getDAOStats();
    } catch {
      // Contracts not deployed yet — return DB-only stats.
    }

    return res.json({
      reports: {
        total:     parseInt(reportStats.total_reports, 10),
        resolved:  parseInt(reportStats.resolved_reports, 10),
        escalated: parseInt(reportStats.escalated_reports, 10),
        onChain:   parseInt(reportStats.on_chain_reports, 10)
      },
      governance: {
        totalVotes:    parseInt(voteStats.total_votes, 10),
        uniqueVoters:  parseInt(voteStats.unique_voters, 10),
        // On-chain values override DB counts when available
        totalProposals: onChainStats?.totalProposals ?? 0,
        totalMembers:   onChainStats?.totalMembers   ?? parseInt(voteStats.unique_voters, 10)
      },
      treasury: {
        totalDonated:    parseFloat(donationStats.total_donated ?? '0'),
        totalDonations:  parseInt(donationStats.total_donations, 10)
      }
    });

  } catch (err: any) {
    logger.error('Failed to get DAO stats:', err);
    return res.status(500).json({ error: 'Failed to retrieve DAO statistics.' });
  }
});

// ─── GET /dao/reports — List reports open for DAO review ─────────────────────

router.get('/reports', optionalAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const db = DatabaseService.getConnection();
    const page   = Math.max(1, parseInt(req.query.page   as string || '1',  10));
    const limit  = Math.min(50, parseInt(req.query.limit  as string || '20', 10));
    const offset = (page - 1) * limit;

    const statusFilter = (req.query.status as string) || 'submitted';

    const [reports, countResult] = await Promise.all([
      db('reports')
        .select(
          'id', 'category', 'severity', 'status', 'priority',
          'votes_for', 'votes_against', 'total_votes', 'vote_score',
          'is_escalated', 'is_on_chain', 'created_at', 'last_updated_at'
        )
        .where({ status: statusFilter })
        .whereNull('deleted_at')
        .orderBy('vote_score', 'desc')
        .orderBy('created_at', 'desc')
        .limit(limit)
        .offset(offset),

      db('reports')
        .count('id as count')
        .where({ status: statusFilter })
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
    logger.error('Failed to list DAO reports:', err);
    return res.status(500).json({ error: 'Failed to retrieve reports.' });
  }
});

// ─── POST /dao/reports/:reportId/vote — Cast a vote on a report ───────────────

router.post('/reports/:reportId/vote', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  const { reportId } = req.params;

  const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!UUID_RE.test(reportId!)) {
    return res.status(400).json({ error: 'Invalid report ID format.' });
  }

  const parse = voteSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ error: 'Invalid vote payload', details: parse.error.flatten().fieldErrors });
  }

  const { decision, voteType, reason, walletAddress, transactionHash } = parse.data;
  const db = DatabaseService.getConnection();

  try {
    // Check report exists and is votable
    const report = await db('reports')
      .where({ id: reportId })
      .whereNull('deleted_at')
      .whereNotIn('status', ['draft', 'resolved', 'rejected', 'archived'])
      .first();

    if (!report) {
      return res.status(404).json({ error: 'Report not found or not open for voting.' });
    }

    // Check for duplicate vote (wallet_address + report_id + vote_type is unique in DB)
    const existing = await db('dao_votes')
      .where({ voter_address: walletAddress.toLowerCase(), report_id: reportId, vote_type: voteType })
      .first();
    if (existing) {
      return res.status(409).json({ error: 'You have already cast this vote on this report.' });
    }

    // Insert vote + update tallies atomically to prevent race conditions
    const { voteId, finalScore, autoEscalated } = await DatabaseService.getInstance().transaction(async (trx) => {
      const [vote] = await trx('dao_votes').insert({
        voter_id:         req.user!.id,
        voter_address:    walletAddress.toLowerCase(),
        report_id:        reportId,
        vote_type:        voteType,
        decision,
        voting_power:     1,
        reason:           reason ?? null,
        transaction_hash: transactionHash ?? null,
        is_valid:         true,
        created_at:       trx.fn.now(),
        updated_at:       trx.fn.now()
      }).returning('id');

      const voteFor     = decision === 'for'     ? 1 : 0;
      const voteAgainst = decision === 'against' ? 1 : 0;

      await trx('reports')
        .where({ id: reportId })
        .increment('votes_for',     voteFor)
        .increment('votes_against', voteAgainst)
        .increment('total_votes',   1);

      // Read updated tallies within the same transaction — consistent view
      const updated = await trx('reports')
        .where({ id: reportId })
        .select('votes_for', 'total_votes', 'is_escalated')
        .first();

      const score = updated.total_votes > 0
        ? (updated.votes_for / updated.total_votes) * 100
        : 0;

      await trx('reports').where({ id: reportId }).update({
        vote_score:      score.toFixed(2),
        last_updated_at: trx.fn.now(),
        updated_at:      trx.fn.now()
      });

      let escalated = false;
      if (updated.total_votes >= 10 && score >= 70 && !updated.is_escalated) {
        await trx('reports').where({ id: reportId }).update({
          is_escalated:    true,
          escalated_at:    trx.fn.now(),
          status:          'escalated',
          last_updated_at: trx.fn.now(),
          updated_at:      trx.fn.now()
        });
        escalated = true;
      }

      return {
        voteId:        typeof vote === 'object' ? vote.id : vote,
        finalScore:    score,
        autoEscalated: escalated
      };
    });

    if (autoEscalated) {
      logger.info(`Report ${reportId} auto-escalated (score: ${finalScore.toFixed(1)}%)`);
    }

    logger.info(`Vote cast: report=${reportId} voter=${walletAddress} decision=${decision}`);
    return res.status(201).json({
      voteId,
      reportId,
      decision,
      voteType
    });

  } catch (err: any) {
    logger.error('Failed to cast vote:', err);
    return res.status(500).json({ error: 'Failed to record vote.' });
  }
});

// ─── GET /dao/reports/:reportId/votes — Get votes for a report ────────────────

router.get('/reports/:reportId/votes', optionalAuth, async (req: AuthenticatedRequest, res: Response) => {
  const { reportId } = req.params;

  const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!UUID_RE.test(reportId!)) {
    return res.status(400).json({ error: 'Invalid report ID format.' });
  }

  try {
    const db = DatabaseService.getConnection();

    const [summary, recentVotes] = await Promise.all([
      db('dao_votes')
        .where({ report_id: reportId, is_valid: true })
        .select(
          db.raw("COUNT(*) as total"),
          db.raw("COUNT(*) FILTER (WHERE decision = 'for') as for_count"),
          db.raw("COUNT(*) FILTER (WHERE decision = 'against') as against_count"),
          db.raw("COUNT(*) FILTER (WHERE decision = 'abstain') as abstain_count")
        )
        .first(),

      db('dao_votes')
        .where({ report_id: reportId, is_valid: true })
        .select('id', 'decision', 'vote_type', 'voting_power', 'reason', 'created_at')
        // Voter address intentionally omitted from public listing to preserve privacy
        .orderBy('created_at', 'desc')
        .limit(20)
    ]);

    return res.json({ summary, recentVotes });

  } catch (err: any) {
    logger.error('Failed to get votes:', err);
    return res.status(500).json({ error: 'Failed to retrieve votes.' });
  }
});

// ─── PATCH /dao/reports/:reportId/status — Moderator status update ───────────

router.patch('/reports/:reportId/status', authMiddleware, requireRole(['moderator', 'admin']), async (req: AuthenticatedRequest, res: Response) => {
  const { reportId } = req.params;
  const { status, reason } = req.body;

  const VALID_STATUSES = ['under_review', 'verified', 'investigating', 'escalated', 'resolved', 'rejected', 'archived'];
  if (!status || !VALID_STATUSES.includes(status)) {
    return res.status(400).json({ error: `Status must be one of: ${VALID_STATUSES.join(', ')}` });
  }

  const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!UUID_RE.test(reportId!)) {
    return res.status(400).json({ error: 'Invalid report ID format.' });
  }

  try {
    const db = DatabaseService.getConnection();
    const updated = await db('reports')
      .where({ id: reportId })
      .whereNull('deleted_at')
      .update({
        status,
        status_reason:   reason ?? null,
        assigned_to:     req.user!.id,
        resolved_at:     status === 'resolved' ? db.fn.now() : null,
        resolved_by:     status === 'resolved' ? req.user!.id : null,
        last_updated_at: db.fn.now(),
        updated_at:      db.fn.now()
      });

    if (updated === 0) return res.status(404).json({ error: 'Report not found.' });

    logger.info(`Report ${reportId} status updated to ${status} by ${req.user!.id}`);
    return res.json({ reportId, status });

  } catch (err: any) {
    logger.error('Failed to update report status:', err);
    return res.status(500).json({ error: 'Failed to update status.' });
  }
});

export default router;
