import { Router } from 'express';
import { DatabaseService } from '@/services/DatabaseService';
import { RedisService } from '@/services/RedisService';
import { BlockchainService } from '@/services/BlockchainService';
import { IPFSService } from '@/services/IPFSService';

const router = Router();

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service health status
 */
router.get('/', async (_req, res) => {
  try {
    const [database, redis, blockchain, ipfs] = await Promise.all([
      DatabaseService.getInstance().healthCheck(),
      RedisService.getInstance().healthCheck(),
      BlockchainService.getInstance().healthCheck(),
      IPFSService.getInstance().healthCheck()
    ]);

    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database,
        redis,
        blockchain,
        ipfs
      },
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development'
    };

    // Determine overall health
    const allHealthy = Object.values(health.services).every(
      service => service.status === 'healthy'
    );

    if (!allHealthy) {
      health.status = 'degraded';
      return res.status(503).json(health);
    }

    res.json(health);
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Health check failed'
    });
  }
});

export default router;
