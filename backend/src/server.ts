import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { createServer } from 'http';

// Import configurations and middleware
import { logger } from '@/utils/logger';
import { errorHandler, notFoundHandler } from '@/middleware/errorHandler';
import { authMiddleware } from '@/middleware/auth';

// Import routes
import authRoutes from '@/routes/auth';
import reportRoutes from '@/routes/reports';
import daoRoutes from '@/routes/dao';
import donationRoutes from '@/routes/donations';
import userRoutes from '@/routes/users';
import adminRoutes from '@/routes/admin';
import healthRoutes from '@/routes/health';

// Import services
import { DatabaseService } from '@/services/DatabaseService';
import { RedisService } from '@/services/RedisService';
import { BlockchainService } from '@/services/BlockchainService';
import { IPFSService } from '@/services/IPFSService';

// Load environment variables
dotenv.config();

class SpeakSafeServer {
  private app: express.Application;
  private server: any;

  private port: number;

  constructor() {
    this.app = express();
    this.port = parseInt(process.env.PORT || '3001', 10);
    this.server = createServer(this.app);


    this.initializeMiddleware();
    this.initializeRoutes();
    this.initializeErrorHandling();

  }

  private initializeMiddleware(): void {
    // Security middleware
    this.app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
          connectSrc: ["'self'", "wss:", "https:"],
          fontSrc: ["'self'"],
          objectSrc: ["'none'"],
          mediaSrc: ["'self'"],
          frameSrc: ["'none'"],
        },
      },
      crossOriginEmbedderPolicy: false
    }));

    // CORS configuration
    this.app.use(cors({
      origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
    }));

    // Rate limiting
    const limiter = rateLimit({
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
      max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
      message: {
        error: 'Too many requests from this IP, please try again later.',
        retryAfter: Math.ceil(parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10) / 1000)
      },
      standardHeaders: true,
      legacyHeaders: false,
      skipSuccessfulRequests: process.env.RATE_LIMIT_SKIP_SUCCESSFUL_REQUESTS === 'true'
    });
    this.app.use('/api', limiter);

    // Body parsing and compression
    this.app.use(compression());
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Logging
    if (process.env.NODE_ENV !== 'test') {
      // Use privacy-safe format: method, url, status, content-length, response-time
      // Excludes :remote-addr (IP address) for anonymity.
      this.app.use(morgan(':method :url :status :res[content-length] - :response-time ms', {
        stream: { write: (message: string) => logger.info(message.trim()) }
      }));
    }

    // Request ID and timing
    this.app.use((req, res, next) => {
      (req as any).id = require('uuid').v4();
      (req as any).startTime = Date.now();
      res.setHeader('X-Request-ID', (req as any).id);
      next();
    });
  }

  private initializeRoutes(): void {
    // Health check (no auth required)
    this.app.use('/api/health', healthRoutes);

    // API routes with versioning
    const apiRouter = express.Router();
    
    // Public routes
    apiRouter.use('/auth', authRoutes);

    // Reports: auth is applied per-handler inside the route file.
    // POST /reports (submit) accepts anonymous requests with no JWT.
    // GET  /reports (list)   requires a JWT.
    // GET  /reports/:id/status is public.
    apiRouter.use('/reports', reportRoutes);

    // Protected routes
    apiRouter.use('/dao', authMiddleware, daoRoutes);
    apiRouter.use('/donations', authMiddleware, donationRoutes);
    apiRouter.use('/users', authMiddleware, userRoutes);
    apiRouter.use('/admin', authMiddleware, adminRoutes);

    this.app.use(`/api/${process.env.API_VERSION || 'v1'}`, apiRouter);

    // API documentation (development only)
    if (process.env.NODE_ENV === 'development' && process.env.SWAGGER_ENABLED === 'true') {
      const swaggerJsdoc = require('swagger-jsdoc');
      const swaggerUi = require('swagger-ui-express');
      
      const options = {
        definition: {
          openapi: '3.0.0',
          info: {
            title: 'SpeakSafe API',
            version: '1.0.0',
            description: 'Anonymous Whistleblowing Platform API',
          },
          servers: [
            {
              url: `http://localhost:${this.port}/api/v1`,
              description: 'Development server',
            },
          ],
        },
        apis: ['./src/routes/*.ts'],
      };

      const specs = swaggerJsdoc(options);
      this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
    }
  }

  private initializeErrorHandling(): void {
    // 404 handler
    this.app.use(notFoundHandler);
    
    // Global error handler
    this.app.use(errorHandler);
  }



  public async start(): Promise<void> {
    try {
      // Initialize services
      await this.initializeServices();

      // Start server
      this.server.listen(this.port, () => {
        logger.info(`🚀 SpeakSafe Backend Server running on port ${this.port}`);
        logger.info(`📚 Environment: ${process.env.NODE_ENV}`);
        logger.info(`🔗 API Base URL: http://localhost:${this.port}/api/v1`);
        
        if (process.env.NODE_ENV === 'development' && process.env.SWAGGER_ENABLED === 'true') {
          logger.info(`📖 API Documentation: http://localhost:${this.port}/api-docs`);
        }
      });

      // Graceful shutdown
      this.setupGracefulShutdown();

    } catch (error) {
      logger.error('Failed to start server:', error);
      process.exit(1);
    }
  }

  private async initializeServices(): Promise<void> {
    try {
      // Initialize database
      await DatabaseService.initialize();
      logger.info('✅ Database connected successfully');

      // Initialize Redis
      await RedisService.initialize();
      logger.info('✅ Redis connected successfully');

      // Initialize blockchain service
      await BlockchainService.initialize();
      logger.info('✅ Blockchain service initialized');

      // Initialize IPFS service
      await IPFSService.initialize();
      logger.info('✅ IPFS service initialized');

    } catch (error) {
      logger.error('Failed to initialize services:', error);
      throw error;
    }
  }

  private setupGracefulShutdown(): void {
    const gracefulShutdown = async (signal: string) => {
      logger.info(`Received ${signal}. Starting graceful shutdown...`);

      // Close server
      this.server.close(async () => {
        logger.info('HTTP server closed');

        try {
          // Close database connections
          await DatabaseService.close();
          logger.info('Database connections closed');

          // Close Redis connection
          await RedisService.close();
          logger.info('Redis connection closed');

          logger.info('Graceful shutdown completed');
          process.exit(0);
        } catch (error) {
          logger.error('Error during graceful shutdown:', error);
          process.exit(1);
        }
      });

      // Force close after 30 seconds
      setTimeout(() => {
        logger.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
      }, 30000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  }

  public getApp(): express.Application {
    return this.app;
  }


}

// Start server if this file is run directly
if (require.main === module) {
  const server = new SpeakSafeServer();
  server.start().catch((error) => {
    logger.error('Failed to start server:', error);
    process.exit(1);
  });
}

export default SpeakSafeServer;
