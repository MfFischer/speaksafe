import { Router, Request, Response } from 'express';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import rateLimit from 'express-rate-limit';
import { logger } from '@/utils/logger';
import { DatabaseService } from '@/services/DatabaseService';
import { RedisService } from '@/services/RedisService';
import { authMiddleware, AuthenticatedRequest } from '@/middleware/auth';

const router = Router();

// ─── Rate limits ──────────────────────────────────────────────────────────────

// M-3: Same Tor/shared-IP trade-off as submitLimiter in reports.ts applies here.
// Future mitigation: per-nonce or Privacy Pass token scheme rather than per-IP.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: { error: 'Too many authentication attempts. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

const JWT_EXPIRY = process.env.JWT_EXPIRY || '1h'; // short-lived; refresh token handles session
const NONCE_TTL_SECONDS = 300; // 5 minutes — challenge must be consumed within this window

function walletChallengeKey(address: string): string {
  return `wallet_challenge:${address.toLowerCase()}`;
}

async function issueChallenge(address: string): Promise<string> {
  const nonce = crypto.randomBytes(32).toString('hex');
  const message = `SpeakSafe wallet login\n\nNonce: ${nonce}\nAddress: ${address.toLowerCase()}\n\nThis nonce expires in 5 minutes and can only be used once.`;
  try {
    const client = RedisService.getInstance().getClient();
    await client.set(walletChallengeKey(address), nonce, { EX: NONCE_TTL_SECONDS });
  } catch {
    // Redis unavailable — challenges won't work without it, fail explicitly.
    throw new Error('Challenge service unavailable. Please try again.');
  }
  return message;
}

async function consumeChallenge(address: string, expectedNonce: string): Promise<boolean> {
  const client = RedisService.getInstance().getClient();
  const stored = await client.get(walletChallengeKey(address));
  if (!stored || stored !== expectedNonce) return false;
  // Delete immediately — single-use
  await client.del(walletChallengeKey(address));
  return true;
}

function signToken(payload: object): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET not configured');
  return jwt.sign(payload, secret, { expiresIn: JWT_EXPIRY } as jwt.SignOptions);
}

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
    reputation_score: user.reputation_score,
    reports_submitted:user.reports_submitted,
    created_at:       user.created_at,
    last_active_at:   user.last_active_at
  };
}

// ─── Schemas ──────────────────────────────────────────────────────────────────

const registerSchema = z.object({
  email:    z.string().email().optional(),
  password: z.string().min(12, 'Password must be at least 12 characters').optional(),
  username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores').optional(),
  walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid wallet address').optional()
}).refine(
  d => d.email || d.walletAddress,
  { message: 'Either email or walletAddress is required' }
);

const loginSchema = z.object({
  email:    z.string().email().optional(),
  password: z.string().optional(),
  walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/).optional(),
  walletSignature: z.string().optional()
}).refine(
  d => (d.email && d.password) || (d.walletAddress && d.walletSignature),
  { message: 'Provide email+password or walletAddress+walletSignature' }
);

// ─── GET /auth/wallet-challenge — Issue a one-time sign challenge ─────────────

router.get('/wallet-challenge', authLimiter, async (req: Request, res: Response) => {
  const address = (req.query.address as string | undefined)?.toLowerCase();
  if (!address || !/^0x[a-f0-9]{40}$/.test(address)) {
    return res.status(400).json({ error: 'Valid wallet address required as ?address= query param.' });
  }
  try {
    const message = await issueChallenge(address);
    return res.json({ message });
  } catch (err: any) {
    logger.error('Failed to issue wallet challenge:', err);
    return res.status(503).json({ error: err.message || 'Challenge service unavailable.' });
  }
});

// ─── POST /auth/register ──────────────────────────────────────────────────────

router.post('/register', authLimiter, async (req: Request, res: Response) => {
  const parse = registerSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ error: 'Invalid request', details: parse.error.flatten().fieldErrors });
  }

  const { email, password, username, walletAddress } = parse.data;
  const db = DatabaseService.getConnection();

  try {
    // Check uniqueness
    if (email) {
      const exists = await db('users').where({ email }).first();
      if (exists) return res.status(409).json({ error: 'Email already registered.' });
    }
    if (walletAddress) {
      const exists = await db('users').where({ wallet_address: walletAddress.toLowerCase() }).first();
      if (exists) return res.status(409).json({ error: 'Wallet address already registered.' });
    }
    if (username) {
      const exists = await db('users').where({ username }).first();
      if (exists) return res.status(409).json({ error: 'Username already taken.' });
    }

    const password_hash = password ? await bcrypt.hash(password, 12) : null;

    const [user] = await db('users').insert({
      email:          email ?? null,
      password_hash,
      username:       username ?? null,
      wallet_address: walletAddress?.toLowerCase() ?? null,
      user_type:      walletAddress && !email ? 'anonymous' : 'registered',
      role:           'user',
      is_verified:    false,
      is_active:      true,
      created_at:     db.fn.now(),
      updated_at:     db.fn.now()
    }).returning('*');

    const token = signToken({ id: user.id, email: user.email, walletAddress: user.wallet_address, role: user.role, isVerified: user.is_verified });

    logger.info(`New user registered: ${user.id} (${email ?? walletAddress})`);
    return res.status(201).json({ token, user: safeUser(user) });

  } catch (err: any) {
    logger.error('Registration failed:', err);
    return res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
});

// ─── POST /auth/login ─────────────────────────────────────────────────────────

router.post('/login', authLimiter, async (req: Request, res: Response) => {
  const parse = loginSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ error: 'Invalid request', details: parse.error.flatten().fieldErrors });
  }

  const { email, password, walletAddress, walletSignature } = parse.data;
  const db = DatabaseService.getConnection();

  try {
    let user: any;

    if (email && password) {
      // ── Email/password login ──────────────────────────────────────────────
      user = await db('users').where({ email }).whereNull('deleted_at').first();
      if (!user || !user.password_hash) {
        return res.status(401).json({ error: 'Invalid credentials.' });
      }
      const valid = await bcrypt.compare(password, user.password_hash);
      if (!valid) return res.status(401).json({ error: 'Invalid credentials.' });

    } else if (walletAddress && walletSignature) {
      // ── Wallet signature login ────────────────────────────────────────────
      // Client must first call GET /auth/wallet-challenge?address=<addr> to obtain
      // a one-time nonce, sign the returned message, then POST it here.
      // The nonce is stored in Redis with a 5-minute TTL and deleted on first use.
      const { ethers } = await import('ethers');
      const nonce = req.body.nonce as string | undefined;
      if (!nonce) {
        return res.status(400).json({ error: 'nonce is required. Call GET /auth/wallet-challenge first.' });
      }

      // Reconstruct the exact challenge message that was issued
      const expectedMessage = `SpeakSafe wallet login\n\nNonce: ${nonce}\nAddress: ${walletAddress.toLowerCase()}\n\nThis nonce expires in 5 minutes and can only be used once.`;

      // Verify signature against the reconstructed message
      let recovered: string;
      try {
        recovered = ethers.verifyMessage(expectedMessage, walletSignature);
      } catch {
        return res.status(401).json({ error: 'Invalid wallet signature.' });
      }
      if (recovered.toLowerCase() !== walletAddress.toLowerCase()) {
        return res.status(401).json({ error: 'Wallet signature does not match address.' });
      }

      // Consume the nonce — single-use, replay is now impossible
      let nonceValid: boolean;
      try {
        nonceValid = await consumeChallenge(walletAddress, nonce);
      } catch {
        return res.status(503).json({ error: 'Challenge service unavailable.' });
      }
      if (!nonceValid) {
        return res.status(401).json({ error: 'Challenge nonce is invalid or expired. Request a new one.' });
      }
      user = await db('users').where({ wallet_address: walletAddress.toLowerCase() }).whereNull('deleted_at').first();
      if (!user) {
        // Auto-create wallet-only account on first login
        const [created] = await db('users').insert({
          wallet_address: walletAddress.toLowerCase(),
          user_type:      'anonymous',
          role:           'user',
          is_verified:    false,
          is_active:      true,
          created_at:     db.fn.now(),
          updated_at:     db.fn.now()
        }).returning('*');
        user = created;
        logger.info(`Wallet user auto-created: ${user.id}`);
      }
    }

    if (!user.is_active) return res.status(403).json({ error: 'Account is inactive.' });
    if (user.is_banned) return res.status(403).json({ error: 'Account is banned.' });

    // Update last active
    await db('users').where({ id: user.id }).update({ last_active_at: db.fn.now(), updated_at: db.fn.now() });

    const token = signToken({ id: user.id, email: user.email, walletAddress: user.wallet_address, role: user.role, isVerified: user.is_verified });

    logger.info(`User logged in: ${user.id}`);
    return res.json({ token, user: safeUser(user) });

  } catch (err: any) {
    logger.error('Login failed:', err);
    return res.status(500).json({ error: 'Login failed. Please try again.' });
  }
});

// ─── GET /auth/me ─────────────────────────────────────────────────────────────

router.get('/me', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const db = DatabaseService.getConnection();
    const user = await db('users').where({ id: req.user!.id }).whereNull('deleted_at').first();
    if (!user) return res.status(404).json({ error: 'User not found.' });
    return res.json({ user: safeUser(user) });
  } catch (err: any) {
    logger.error('Failed to fetch user profile:', err);
    return res.status(500).json({ error: 'Failed to retrieve profile.' });
  }
});

// ─── POST /auth/logout ────────────────────────────────────────────────────────
// JWTs are stateless — logout is handled client-side by discarding the token.
// This endpoint exists as a hook for future token blacklist / refresh-token logic.

router.post('/logout', authMiddleware, (_req: AuthenticatedRequest, res: Response) => {
  return res.json({ message: 'Logged out successfully.' });
});

export default router;
