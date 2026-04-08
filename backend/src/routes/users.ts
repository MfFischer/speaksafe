import { Router, Response } from 'express';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { logger } from '@/utils/logger';
import { DatabaseService } from '@/services/DatabaseService';
import { authMiddleware, AuthenticatedRequest } from '@/middleware/auth';

const router = Router();

// All /users routes require authentication
router.use(authMiddleware);

// ─── Helpers ──────────────────────────────────────────────────────────────────

function safeUser(user: any) {
  // Allowlist — future DB columns will not leak automatically.
  return {
    id:               user.id,
    email:            user.email,
    username:         user.username,
    wallet_address:   user.wallet_address,
    role:             user.role,
    user_type:        user.user_type,
    is_active:        user.is_active,
    is_banned:        user.is_banned,
    is_verified:      user.is_verified,
    display_name:     user.display_name,
    bio:              user.bio,
    avatar_url:       user.avatar_url,
    country_code:     user.country_code,
    timezone:         user.timezone,
    allow_contact:    user.allow_contact,
    privacy_settings: user.privacy_settings,
    reputation_score: user.reputation_score,
    reports_submitted:user.reports_submitted,
    created_at:       user.created_at,
    last_active_at:   user.last_active_at
  };
}

// ─── Schemas ──────────────────────────────────────────────────────────────────

const updateProfileSchema = z.object({
  username:     z.string().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/).optional(),
  displayName:  z.string().max(60).optional(),
  bio:          z.string().max(500).optional(),
  countryCode:  z.string().length(2).optional(),
  timezone:     z.string().max(50).optional(),
  allowContact: z.boolean().optional(),
  privacySettings: z.record(z.boolean()).optional()
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword:     z.string().min(12, 'Password must be at least 12 characters')
});

// ─── GET /users/me — Full authenticated user profile ─────────────────────────

router.get('/me', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const db = DatabaseService.getConnection();
    const user = await db('users').where({ id: req.user!.id }).whereNull('deleted_at').first();
    if (!user) return res.status(404).json({ error: 'User not found.' });

    // Attach submission/activity counts
    const [reportCount, voteCount, donationSum] = await Promise.all([
      db('reports').count('id as count').where({ reporter_id: user.id }).whereNull('deleted_at').first(),
      db('dao_votes').count('id as count').where({ voter_id: user.id }).first(),
      db('donations').sum('amount as total').where({ donor_id: user.id }).whereIn('status', ['confirmed', 'processed']).first()
    ]);

    return res.json({
      user: safeUser(user),
      activity: {
        reportsSubmitted: parseInt(reportCount?.count as string ?? '0', 10),
        votesCast:        parseInt(voteCount?.count as string ?? '0', 10),
        totalDonated:     parseFloat(donationSum?.total ?? '0')
      }
    });

  } catch (err: any) {
    logger.error('Failed to get user profile:', err);
    return res.status(500).json({ error: 'Failed to retrieve profile.' });
  }
});

// ─── PATCH /users/me — Update profile ────────────────────────────────────────

router.patch('/me', async (req: AuthenticatedRequest, res: Response) => {
  const parse = updateProfileSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ error: 'Invalid request', details: parse.error.flatten().fieldErrors });
  }

  const { username, displayName, bio, countryCode, timezone, allowContact, privacySettings } = parse.data;
  const db = DatabaseService.getConnection();

  try {
    // Username uniqueness check
    if (username) {
      const existing = await db('users').where({ username }).whereNot({ id: req.user!.id }).first();
      if (existing) return res.status(409).json({ error: 'Username already taken.' });
    }

    const [updated] = await db('users')
      .where({ id: req.user!.id })
      .whereNull('deleted_at')
      .update({
        ...(username     !== undefined && { username }),
        ...(displayName  !== undefined && { display_name: displayName }),
        ...(bio          !== undefined && { bio }),
        ...(countryCode  !== undefined && { country_code: countryCode }),
        ...(timezone     !== undefined && { timezone }),
        ...(allowContact !== undefined && { allow_contact: allowContact }),
        ...(privacySettings !== undefined && { privacy_settings: JSON.stringify(privacySettings) }),
        updated_at: db.fn.now()
      })
      .returning('*');

    if (!updated) return res.status(404).json({ error: 'User not found.' });

    logger.info(`User profile updated: ${req.user!.id}`);
    return res.json({ user: safeUser(updated) });

  } catch (err: any) {
    logger.error('Failed to update profile:', err);
    return res.status(500).json({ error: 'Failed to update profile.' });
  }
});

// ─── POST /users/me/change-password ──────────────────────────────────────────

router.post('/me/change-password', async (req: AuthenticatedRequest, res: Response) => {
  const parse = changePasswordSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ error: 'Invalid request', details: parse.error.flatten().fieldErrors });
  }

  const { currentPassword, newPassword } = parse.data;
  const db = DatabaseService.getConnection();

  try {
    const user = await db('users').where({ id: req.user!.id }).whereNull('deleted_at').first();
    if (!user || !user.password_hash) {
      return res.status(400).json({ error: 'Password change not available for wallet-only accounts.' });
    }

    const valid = await bcrypt.compare(currentPassword, user.password_hash);
    if (!valid) return res.status(401).json({ error: 'Current password is incorrect.' });

    const newHash = await bcrypt.hash(newPassword, 12);
    await db('users').where({ id: req.user!.id }).update({
      password_hash:       newHash,
      password_changed_at: db.fn.now(),
      updated_at:          db.fn.now()
    });

    logger.info(`Password changed for user: ${req.user!.id}`);
    return res.json({ message: 'Password changed successfully.' });

  } catch (err: any) {
    logger.error('Failed to change password:', err);
    return res.status(500).json({ error: 'Failed to change password.' });
  }
});

// ─── DELETE /users/me — Soft-delete account ──────────────────────────────────

router.delete('/me', async (req: AuthenticatedRequest, res: Response) => {
  const db = DatabaseService.getConnection();

  try {
    await db('users')
      .where({ id: req.user!.id })
      .whereNull('deleted_at')
      .update({
        deleted_at:  db.fn.now(),
        is_active:   false,
        updated_at:  db.fn.now(),
        // Anonymise PII on deletion
        email:        null,
        password_hash: null,
        display_name:  null,
        bio:           null,
        avatar_url:    null
      });

    logger.info(`User account deleted: ${req.user!.id}`);
    return res.json({ message: 'Account deleted successfully.' });

  } catch (err: any) {
    logger.error('Failed to delete account:', err);
    return res.status(500).json({ error: 'Failed to delete account.' });
  }
});

export default router;
