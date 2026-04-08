import { Router, Response } from 'express';
import { z } from 'zod';
import { logger } from '@/utils/logger';
import { DatabaseService } from '@/services/DatabaseService';
import { RedisService } from '@/services/RedisService';
import { authMiddleware, requireRole, AuthenticatedRequest } from '@/middleware/auth';

const router = Router();

// All /admin routes require authentication AND admin role
router.use(authMiddleware);
router.use(requireRole(['admin']));

// ─── Schemas ──────────────────────────────────────────────────────────────────

const updateReportStatusSchema = z.object({
  status: z.enum(['under_review', 'verified', 'investigating', 'escalated', 'resolved', 'rejected', 'archived']),
  reason: z.string().max(1000).optional(),
  priority: z.enum(['low', 'normal', 'high', 'urgent']).optional()
});

const updateUserSchema = z.object({
  role:      z.enum(['user', 'moderator', 'admin']).optional(),
  is_active: z.boolean().optional(),
  is_banned: z.boolean().optional(),
  ban_reason: z.string().max(500).optional(),
  banned_until: z.string().datetime().optional()
});

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const VALID_REPORT_STATUSES = new Set(['draft','submitted','under_review','verified','investigating','escalated','resolved','rejected','archived']);
const VALID_CATEGORIES      = new Set(['corruption','fraud','misconduct','safety_violation','environmental','human_rights','financial_crime','other']);
const VALID_USER_ROLES      = new Set(['user','moderator','admin']);

// ─── GET /admin/stats — Platform-wide overview ─────────────────────────────────

router.get('/stats', async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const db = DatabaseService.getConnection();

    const [reportStats, userStats, voteStats, donationStats] = await Promise.all([
      db('reports')
        .select(
          db.raw('COUNT(*) as total'),
          db.raw("COUNT(*) FILTER (WHERE status = 'submitted')     as pending"),
          db.raw("COUNT(*) FILTER (WHERE status = 'under_review')  as under_review"),
          db.raw("COUNT(*) FILTER (WHERE status = 'investigating') as investigating"),
          db.raw("COUNT(*) FILTER (WHERE status = 'escalated')     as escalated"),
          db.raw("COUNT(*) FILTER (WHERE status = 'resolved')      as resolved"),
          db.raw("COUNT(*) FILTER (WHERE status = 'rejected')      as rejected"),
          db.raw("COUNT(*) FILTER (WHERE is_on_chain = true)       as on_chain"),
          db.raw("COUNT(*) FILTER (WHERE is_anonymous = true)      as anonymous"),
          db.raw("COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '24 hours') as last_24h")
        )
        .whereNull('deleted_at')
        .first(),

      db('users')
        .select(
          db.raw('COUNT(*) as total'),
          db.raw("COUNT(*) FILTER (WHERE is_active = true)  as active"),
          db.raw("COUNT(*) FILTER (WHERE is_banned = true)  as banned"),
          db.raw("COUNT(*) FILTER (WHERE role = 'admin')    as admins"),
          db.raw("COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '24 hours') as new_today")
        )
        .whereNull('deleted_at')
        .first(),

      db('dao_votes')
        .select(
          db.raw('COUNT(*) as total'),
          db.raw('COUNT(DISTINCT voter_address) as unique_voters')
        )
        .first(),

      db('donations')
        .select(
          db.raw("SUM(amount) FILTER (WHERE status IN ('confirmed','processed')) as total_donated"),
          db.raw("COUNT(*) FILTER (WHERE status IN ('confirmed','processed')) as confirmed_count"),
          db.raw("COUNT(*) FILTER (WHERE status = 'pending') as pending_count")
        )
        .first()
    ]);

    return res.json({
      reports:   reportStats,
      users:     userStats,
      votes:     voteStats,
      donations: donationStats,
      generatedAt: new Date().toISOString()
    });

  } catch (err: any) {
    logger.error('Admin stats query failed:', err);
    return res.status(500).json({ error: 'Failed to retrieve platform statistics.' });
  }
});

// ─── GET /admin/reports — Full report list with all fields ────────────────────

router.get('/reports', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const db  = DatabaseService.getConnection();
    const page   = Math.max(1, parseInt(req.query.page   as string || '1',  10));
    const limit  = Math.min(100, parseInt(req.query.limit  as string || '20', 10));
    const offset = (page - 1) * limit;

    const statusFilter   = req.query.status   as string | undefined;
    const categoryFilter = req.query.category as string | undefined;
    const onChainFilter  = req.query.onChain  as string | undefined;

    if (statusFilter && !VALID_REPORT_STATUSES.has(statusFilter)) {
      return res.status(400).json({ error: `Invalid status filter. Valid values: ${[...VALID_REPORT_STATUSES].join(', ')}` });
    }
    if (categoryFilter && !VALID_CATEGORIES.has(categoryFilter)) {
      return res.status(400).json({ error: `Invalid category filter. Valid values: ${[...VALID_CATEGORIES].join(', ')}` });
    }

    let query = db('reports').whereNull('deleted_at');
    if (statusFilter)   query = query.where({ status: statusFilter });
    if (categoryFilter) query = query.where({ category: categoryFilter });
    if (onChainFilter !== undefined) query = query.where({ is_on_chain: onChainFilter === 'true' });

    const [reports, countResult] = await Promise.all([
      query.clone()
        .select(
          'id', 'category', 'severity', 'status', 'priority',
          'is_anonymous', 'is_on_chain', 'blockchain_tx_hash',
          'reporter_hash', 'anonymous_id',
          'votes_for', 'votes_against', 'total_votes', 'vote_score',
          'is_escalated', 'created_at', 'last_updated_at', 'resolved_at'
        )
        .orderBy('created_at', 'desc')
        .limit(limit)
        .offset(offset),

      query.clone().count('id as count')
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
    logger.error('Admin report list failed:', err);
    return res.status(500).json({ error: 'Failed to retrieve reports.' });
  }
});

// ─── PATCH /admin/reports/:id/status — Update report status ──────────────────

router.patch('/reports/:id/status', async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  if (!UUID_RE.test(id!)) return res.status(400).json({ error: 'Invalid report ID.' });

  const parse = updateReportStatusSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ error: 'Invalid request', details: parse.error.flatten().fieldErrors });
  }

  const { status, reason, priority } = parse.data;
  const db = DatabaseService.getConnection();

  try {
    const updated = await db('reports')
      .where({ id })
      .whereNull('deleted_at')
      .update({
        status,
        ...(reason   && { status_reason: reason }),
        ...(priority && { priority }),
        assigned_to:     req.user!.id,
        resolved_at:     status === 'resolved' ? db.fn.now() : db.raw('resolved_at'),
        resolved_by:     status === 'resolved' ? req.user!.id : db.raw('resolved_by'),
        last_updated_at: db.fn.now(),
        updated_at:      db.fn.now()
      });

    if (updated === 0) return res.status(404).json({ error: 'Report not found.' });

    logger.info(`[ADMIN] Report ${id} status → ${status} by ${req.user!.id}`);
    return res.json({ reportId: id, status });

  } catch (err: any) {
    logger.error('Admin status update failed:', err);
    return res.status(500).json({ error: 'Failed to update report status.' });
  }
});

// ─── DELETE /admin/reports/:id — Soft-delete a report ────────────────────────

router.delete('/reports/:id', async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  if (!UUID_RE.test(id!)) return res.status(400).json({ error: 'Invalid report ID.' });

  const db = DatabaseService.getConnection();

  try {
    const deleted = await db('reports')
      .where({ id })
      .whereNull('deleted_at')
      .update({ deleted_at: db.fn.now(), updated_at: db.fn.now() });

    if (deleted === 0) return res.status(404).json({ error: 'Report not found.' });

    logger.info(`[ADMIN] Report ${id} soft-deleted by ${req.user!.id}`);
    return res.json({ message: 'Report deleted.' });

  } catch (err: any) {
    logger.error('Admin report delete failed:', err);
    return res.status(500).json({ error: 'Failed to delete report.' });
  }
});

// ─── GET /admin/users — List all users ───────────────────────────────────────

router.get('/users', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const db  = DatabaseService.getConnection();
    const page   = Math.max(1, parseInt(req.query.page  as string || '1',  10));
    const limit  = Math.min(100, parseInt(req.query.limit as string || '20', 10));
    const offset = (page - 1) * limit;

    const roleFilter     = req.query.role     as string | undefined;
    const bannedFilter   = req.query.banned   as string | undefined;

    if (roleFilter && !VALID_USER_ROLES.has(roleFilter)) {
      return res.status(400).json({ error: `Invalid role filter. Valid values: ${[...VALID_USER_ROLES].join(', ')}` });
    }

    let query = db('users').whereNull('deleted_at');
    if (roleFilter)   query = query.where({ role: roleFilter });
    if (bannedFilter !== undefined) query = query.where({ is_banned: bannedFilter === 'true' });

    const [users, countResult2] = await Promise.all([
      query.clone()
        .select('id', 'email', 'username', 'wallet_address', 'role', 'user_type', 'is_active', 'is_banned', 'is_verified', 'reputation_score', 'reports_submitted', 'created_at', 'last_active_at')
        .orderBy('created_at', 'desc')
        .limit(limit)
        .offset(offset),

      query.clone().count('id as count')
    ]);

    const count2 = (countResult2 as any)[0]?.count ?? 0;

    return res.json({
      users,
      pagination: {
        page,
        limit,
        total:      parseInt(count2 as string, 10),
        totalPages: Math.ceil(parseInt(count2 as string, 10) / limit)
      }
    });

  } catch (err: any) {
    logger.error('Admin user list failed:', err);
    return res.status(500).json({ error: 'Failed to retrieve users.' });
  }
});

// ─── PATCH /admin/users/:id — Update user role / ban status ──────────────────

router.patch('/users/:id', async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  if (!UUID_RE.test(id!)) return res.status(400).json({ error: 'Invalid user ID.' });

  // Prevent self-demotion
  if (id === req.user!.id) {
    return res.status(400).json({ error: 'Cannot modify your own account via admin endpoint.' });
  }

  const parse = updateUserSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ error: 'Invalid request', details: parse.error.flatten().fieldErrors });
  }

  const { role, is_active, is_banned, ban_reason, banned_until } = parse.data;
  const db = DatabaseService.getConnection();

  try {
    const updated = await db('users')
      .where({ id })
      .whereNull('deleted_at')
      .update({
        ...(role       !== undefined && { role }),
        ...(is_active  !== undefined && { is_active }),
        ...(is_banned  !== undefined && { is_banned }),
        ...(ban_reason !== undefined && { ban_reason }),
        ...(banned_until !== undefined && { banned_until }),
        updated_at: db.fn.now()
      });

    if (updated === 0) return res.status(404).json({ error: 'User not found.' });

    // Propagate ban state to Redis so the auth middleware can reject the user's
    // existing JWTs within the 1-hour expiry window (L-1).
    const JWT_EXPIRY_SECONDS = parseInt(process.env.JWT_EXPIRY_SECONDS || '3600', 10);
    if (is_banned === true) {
      try {
        await RedisService.getInstance().getClient().set(`user_banned:${id}`, '1', { EX: JWT_EXPIRY_SECONDS });
      } catch { /* non-fatal */ }
    } else if (is_banned === false) {
      try {
        await RedisService.getInstance().getClient().del(`user_banned:${id}`);
      } catch { /* non-fatal */ }
    }

    logger.info(`[ADMIN] User ${id} updated by ${req.user!.id}: ${JSON.stringify(parse.data)}`);
    return res.json({ userId: id, updated: parse.data });

  } catch (err: any) {
    logger.error('Admin user update failed:', err);
    return res.status(500).json({ error: 'Failed to update user.' });
  }
});

export default router;
