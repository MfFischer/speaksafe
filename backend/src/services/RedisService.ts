import { createClient, RedisClientType } from 'redis';
import { logger } from '@/utils/logger';

class RedisService {
  private static instance: RedisService;
  private client: RedisClientType | null = null;
  private isInitialized: boolean = false;

  private constructor() {}

  public static getInstance(): RedisService {
    if (!RedisService.instance) {
      RedisService.instance = new RedisService();
    }
    return RedisService.instance;
  }

  public async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
      
      this.client = createClient({
        url: redisUrl,
        password: process.env.REDIS_PASSWORD,
        socket: {
          reconnectStrategy: (retries) => Math.min(retries * 50, 1000)
        }
      });

      this.client.on('error', (err) => {
        logger.error('Redis Client Error:', err);
      });

      this.client.on('connect', () => {
        logger.info('Redis client connected');
      });

      this.client.on('ready', () => {
        logger.info('Redis client ready');
      });

      await this.client.connect();
      this.isInitialized = true;
      logger.info('✅ Redis Service initialized successfully');
    } catch (error) {
      logger.warn('⚠️ Failed to connect to Redis. Continuing in limited mode.');
      logger.warn('Error detail:', (error as Error).message);
      // We don't throw here to allow the server to boot for demo purposes
      this.isInitialized = true; 
    }
  }

  public static async initialize(): Promise<void> {
    const instance = RedisService.getInstance();
    await instance.initialize();
  }

  public getClient(): RedisClientType {
    if (!this.isInitialized || !this.client) {
      throw new Error('Redis Service not initialized');
    }
    return this.client;
  }

  public async close(): Promise<void> {
    if (this.client) {
      await this.client.quit();
      this.isInitialized = false;
      logger.info('Redis connection closed');
    }
  }

  public static async close(): Promise<void> {
    const instance = RedisService.getInstance();
    await instance.close();
  }

  // Cache methods
  public async set(key: string, value: string, ttl?: number): Promise<void> {
    const client = this.getClient();
    if (ttl) {
      await client.setEx(key, ttl, value);
    } else {
      await client.set(key, value);
    }
  }

  public async get(key: string): Promise<string | null> {
    const client = this.getClient();
    return await client.get(key);
  }

  public async del(key: string): Promise<number> {
    const client = this.getClient();
    return await client.del(key);
  }

  public async exists(key: string): Promise<number> {
    const client = this.getClient();
    return await client.exists(key);
  }

  // Hash methods
  public async hSet(key: string, field: string, value: string): Promise<number> {
    const client = this.getClient();
    return await client.hSet(key, field, value);
  }

  public async hGet(key: string, field: string): Promise<string | undefined> {
    const client = this.getClient();
    return await client.hGet(key, field);
  }

  public async hGetAll(key: string): Promise<Record<string, string>> {
    const client = this.getClient();
    return await client.hGetAll(key);
  }

  // List methods
  public async lPush(key: string, ...values: string[]): Promise<number> {
    const client = this.getClient();
    return await client.lPush(key, values);
  }

  public async rPop(key: string): Promise<string | null> {
    const client = this.getClient();
    return await client.rPop(key);
  }

  // Set methods
  public async sAdd(key: string, ...members: string[]): Promise<number> {
    const client = this.getClient();
    return await client.sAdd(key, members);
  }

  public async sMembers(key: string): Promise<string[]> {
    const client = this.getClient();
    return await client.sMembers(key);
  }

  // Health check
  public async healthCheck(): Promise<{ status: string; timestamp: Date }> {
    try {
      const client = this.getClient();
      await client.ping();
      return {
        status: 'healthy',
        timestamp: new Date()
      };
    } catch (error) {
      logger.error('Redis health check failed:', error);
      return {
        status: 'unhealthy',
        timestamp: new Date()
      };
    }
  }
}

export { RedisService };
