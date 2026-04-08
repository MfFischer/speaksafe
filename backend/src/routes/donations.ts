import { Router, Response } from 'express';
import { z } from 'zod';
import { logger } from '@/utils/logger';
import { DatabaseService } from '@/services/DatabaseService';
import { authMiddleware, optionalAuth, AuthenticatedRequest } from '@/middleware/auth';

const router = Router();

// ─── Schemas ──────────────────────────────────────────────────────────────────

const recordDonationSchema = z.object({
  transactionHash:  z.string().regex(/^0x[0-9a-fA-F]{64}$/, 'Invalid transaction hash'),
  donorAddress:     z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid wallet address'),
  amount:           z.string().regex(/^\d+(\.\d+)?$/, 'Amount must be a numeric string'),
  currency:         z.string().min(1).max(10).default('MATIC'),
  purpose:          z.enum(['general_fund', 'report_sponsorship', 'platform_development', 'legal_support', 'community_rewards', 'infrastructure']).default('general_fund'),
  sponsoredReportId: z.string().uuid().optional(),
  isAnonymous:      z.boolean().default(false),
  donorMessage:     z.string().max(500).optional(),
  showOnLeaderboard: z.boolean().default(false)
});

// ─── POST /donations — Record a confirmed on-chain donation ──────────────────
// The client submits the tx to the Treasury contract directly, then records it here.

router.post('/', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  const parse = recordDonationSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ error: 'Invalid request', details: parse.error.flatten().fieldErrors });
  }

  const data = parse.data;
  const db = DatabaseService.getConnection();

  try {
    // Prevent duplicate recording of the same tx
    const existing = await db('donations').where({ transaction_hash: data.transactionHash }).first();
    if (existing) {
      return res.status(409).json({ error: 'This transaction has already been recorded.' });
    }

    // Validate sponsored report exists (if provided)
    if (data.sponsoredReportId) {
      const report = await db('reports').where({ id: data.sponsoredReportId }).whereNull('deleted_at').first();
      if (!report) {
        return res.status(404).json({ error: 'Sponsored report not found.' });
      }
    }

    const [donation] = await db('donations').insert({
      donor_id:           req.user!.id,
      donor_address:      data.donorAddress.toLowerCase(),
      is_anonymous:       data.isAnonymous,
      amount:             data.amount,
      currency:           data.currency,
      donation_type:      'one_time',
      purpose:            data.purpose,
      sponsored_report_id: data.sponsoredReportId ?? null,
      transaction_hash:   data.transactionHash,
      status:             'confirmed',
      confirmed_at:       db.fn.now(),
      donor_message:      data.donorMessage ?? null,
      show_on_leaderboard: data.showOnLeaderboard,
      display_name:       data.isAnonymous ? null : req.user!.email ?? data.donorAddress,
      eligible_for_rewards: true,
      created_at:         db.fn.now(),
      updated_at:         db.fn.now()
    }).returning('id');

    const donationId: string = typeof donation === 'object' ? donation.id : donation;

    // Increment donor's total_donated
    await db('users')
      .where({ id: req.user!.id })
      .increment('total_donated', parseFloat(data.amount));

    logger.info(`Donation recorded: ${donationId} — ${data.amount} ${data.currency} from ${data.donorAddress}`);
    return res.status(201).json({ donationId, status: 'confirmed' });

  } catch (err: any) {
    logger.error('Failed to record donation:', err);
    return res.status(500).json({ error: 'Failed to record donation.' });
  }
});

// ─── GET /donations — List the authenticated user's donations ─────────────────

router.get('/', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const db = DatabaseService.getConnection();
    const page   = Math.max(1, parseInt(req.query.page  as string || '1',  10));
    const limit  = Math.min(50, parseInt(req.query.limit as string || '20', 10));
    const offset = (page - 1) * limit;

    const [donations, countResult] = await Promise.all([
      db('donations')
        .select('id', 'amount', 'currency', 'purpose', 'status', 'donation_type', 'transaction_hash', 'sponsored_report_id', 'created_at', 'confirmed_at')
        .where({ donor_id: req.user!.id })
        .orderBy('created_at', 'desc')
        .limit(limit)
        .offset(offset),

      db('donations')
        .count('id as count')
        .where({ donor_id: req.user!.id })
    ]);

    const count = (countResult as any)[0]?.count ?? 0;

    return res.json({
      donations,
      pagination: {
        page,
        limit,
        total:      parseInt(count as string, 10),
        totalPages: Math.ceil(parseInt(count as string, 10) / limit)
      }
    });

  } catch (err: any) {
    logger.error('Failed to list donations:', err);
    return res.status(500).json({ error: 'Failed to retrieve donations.' });
  }
});

// ─── GET /donations/leaderboard — Public top donors ──────────────────────────

router.get('/leaderboard', optionalAuth, async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const db = DatabaseService.getConnection();

    const leaders = await db('donations')
      .select('donor_address', 'display_name', 'is_anonymous')
      .sum('amount as total_donated')
      .count('id as donation_count')
      .where({ show_on_leaderboard: true })
      .whereIn('status', ['confirmed', 'processed'])
      .groupBy('donor_address', 'display_name', 'is_anonymous')
      .orderBy('total_donated', 'desc')
      .limit(20);

    // Mask addresses for anonymous donors
    const sanitised = leaders.map((l: any) => ({
      displayName:   l.is_anonymous ? 'Anonymous Donor' : (l.display_name || `${l.donor_address.slice(0, 6)}…${l.donor_address.slice(-4)}`),
      totalDonated:  parseFloat(l.total_donated),
      donationCount: parseInt(l.donation_count, 10),
      isAnonymous:   l.is_anonymous
    }));

    return res.json({ leaderboard: sanitised });

  } catch (err: any) {
    logger.error('Failed to get leaderboard:', err);
    return res.status(500).json({ error: 'Failed to retrieve leaderboard.' });
  }
});

// ─── GET /donations/stats — Public platform donation statistics ───────────────

router.get('/stats', optionalAuth, async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const db = DatabaseService.getConnection();

    const stats = await db('donations')
      .select(
        db.raw("SUM(amount) FILTER (WHERE status IN ('confirmed','processed')) as total_donated"),
        db.raw("COUNT(*) FILTER (WHERE status IN ('confirmed','processed')) as total_donations"),
        db.raw("COUNT(DISTINCT donor_address) FILTER (WHERE status IN ('confirmed','processed')) as unique_donors"),
        db.raw("SUM(sponsored_reports_count) as total_reports_sponsored")
      )
      .first();

    return res.json({
      totalDonated:         parseFloat(stats.total_donated ?? '0'),
      totalDonations:       parseInt(stats.total_donations ?? '0', 10),
      uniqueDonors:         parseInt(stats.unique_donors ?? '0', 10),
      totalReportsSponsored: parseInt(stats.total_reports_sponsored ?? '0', 10)
    });

  } catch (err: any) {
    logger.error('Failed to get donation stats:', err);
    return res.status(500).json({ error: 'Failed to retrieve donation statistics.' });
  }
});

export default router;
