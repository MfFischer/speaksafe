import { create, IPFSHTTPClient } from 'ipfs-http-client';
import { logger } from '@/utils/logger';
import crypto from 'crypto';

export interface EncryptedContent {
  encryptedData: string;
  iv: string;
  authTag: string;
  algorithm: string;
}

export interface IPFSUploadResult {
  hash: string;
  size: number;
  url: string;
}

export interface ReportContent {
  title: string;
  description: string;
  category: string;
  severity: string;
  evidence: EvidenceFile[];
  metadata: ReportMetadata;
}

export interface EvidenceFile {
  filename: string;
  contentType: string;
  size: number;
  hash: string;
  encryptedContent: EncryptedContent;
}

export interface ReportMetadata {
  timestamp: number;
  location?: {
    country: string;
    region?: string;
    coordinates?: [number, number]; // [lat, lng] - encrypted
  };
  organization?: {
    name: string;
    type: string;
    size?: string;
  };
  incident: {
    date: number;
    estimatedImpact?: number;
    peopleAffected?: number;
    witnesses?: number;
  };
  reporter: {
    anonymousId: string;
    verificationLevel: number;
    relationship?: string; // to organization
  };
}

class IPFSService {
  private static instance: IPFSService;
  private client: IPFSHTTPClient | null = null;
  private isInitialized: boolean = false;
  private encryptionKey: Buffer;
  private gatewayUrl: string;

  private constructor() {
    // Initialize encryption key from environment
    const keyString = process.env.ENCRYPTION_KEY || 'default-key-change-in-production';
    this.encryptionKey = crypto.scryptSync(keyString, 'salt', 32);
    this.gatewayUrl = process.env.IPFS_GATEWAY_URL || 'http://localhost:8080';
  }

  public static getInstance(): IPFSService {
    if (!IPFSService.instance) {
      IPFSService.instance = new IPFSService();
    }
    return IPFSService.instance;
  }

  public async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      const apiUrl = process.env.IPFS_API_URL || 'http://localhost:5001';
      
      // Create IPFS client
      this.client = create({
        url: apiUrl,
        headers: process.env.IPFS_PROJECT_ID ? {
          authorization: `Basic ${Buffer.from(
            `${process.env.IPFS_PROJECT_ID}:${process.env.IPFS_PROJECT_SECRET}`
          ).toString('base64')}`
        } : undefined
      });

      // Test connection
      const version = await this.client.version();
      logger.info(`Connected to IPFS node version: ${version.version}`);

      this.isInitialized = true;
      logger.info('IPFS Service initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize IPFS Service:', error);
      throw error;
    }
  }

  public static async initialize(): Promise<void> {
    const instance = IPFSService.getInstance();
    await instance.initialize();
  }

  /**
   * Upload encrypted report content to IPFS
   */
  public async uploadReport(
    reportContent: ReportContent,
    encryptionKey?: string
  ): Promise<IPFSUploadResult> {
    if (!this.isInitialized || !this.client) {
      throw new Error('IPFS Service not initialized');
    }

    try {
      logger.info('Uploading encrypted report to IPFS');

      // Encrypt the report content
      const encryptedContent = this.encryptData(
        JSON.stringify(reportContent),
        encryptionKey
      );

      // Create metadata for the upload
      const uploadData = {
        type: 'encrypted_report',
        timestamp: Date.now(),
        version: '1.0',
        content: encryptedContent
      };

      // Upload to IPFS
      const result = await this.client.add(JSON.stringify(uploadData), {
        pin: true,
        cidVersion: 1
      });

      const uploadResult: IPFSUploadResult = {
        hash: result.cid.toString(),
        size: result.size,
        url: `${this.gatewayUrl}/ipfs/${result.cid.toString()}`
      };

      logger.info(`Report uploaded to IPFS: ${uploadResult.hash}`);
      return uploadResult;

    } catch (error) {
      logger.error('Failed to upload report to IPFS:', error);
      throw new Error('IPFS upload failed');
    }
  }

  /**
   * Upload evidence file to IPFS
   */
  public async uploadEvidence(
    fileBuffer: Buffer,
    filename: string,
    contentType: string,
    encryptionKey?: string
  ): Promise<IPFSUploadResult> {
    if (!this.isInitialized || !this.client) {
      throw new Error('IPFS Service not initialized');
    }

    try {
      logger.info(`Uploading evidence file to IPFS: ${filename}`);

      // Encrypt the file content
      const encryptedContent = this.encryptData(fileBuffer.toString('base64'), encryptionKey);

      // Create file metadata
      const fileData = {
        type: 'encrypted_evidence',
        filename,
        contentType,
        originalSize: fileBuffer.length,
        timestamp: Date.now(),
        content: encryptedContent
      };

      // Upload to IPFS
      const result = await this.client.add(JSON.stringify(fileData), {
        pin: true,
        cidVersion: 1
      });

      const uploadResult: IPFSUploadResult = {
        hash: result.cid.toString(),
        size: result.size,
        url: `${this.gatewayUrl}/ipfs/${result.cid.toString()}`
      };

      logger.info(`Evidence file uploaded to IPFS: ${uploadResult.hash}`);
      return uploadResult;

    } catch (error) {
      logger.error('Failed to upload evidence to IPFS:', error);
      throw new Error('Evidence upload failed');
    }
  }

  /**
   * Download and decrypt report content from IPFS
   */
  public async downloadReport(
    ipfsHash: string,
    decryptionKey?: string
  ): Promise<ReportContent> {
    if (!this.isInitialized || !this.client) {
      throw new Error('IPFS Service not initialized');
    }

    try {
      logger.info(`Downloading report from IPFS: ${ipfsHash}`);

      // Download from IPFS
      const chunks: Uint8Array[] = [];
      for await (const chunk of this.client.cat(ipfsHash)) {
        chunks.push(chunk);
      }

      const data = Buffer.concat(chunks).toString();
      const uploadData = JSON.parse(data);

      // Decrypt the content
      const decryptedContent = this.decryptData(uploadData.content, decryptionKey);
      const reportContent: ReportContent = JSON.parse(decryptedContent);

      logger.info(`Report downloaded and decrypted from IPFS: ${ipfsHash}`);
      return reportContent;

    } catch (error) {
      logger.error('Failed to download report from IPFS:', error);
      throw new Error('IPFS download failed');
    }
  }

  /**
   * Download and decrypt evidence file from IPFS
   */
  public async downloadEvidence(
    ipfsHash: string,
    decryptionKey?: string
  ): Promise<{ filename: string; contentType: string; content: Buffer }> {
    if (!this.isInitialized || !this.client) {
      throw new Error('IPFS Service not initialized');
    }

    try {
      logger.info(`Downloading evidence from IPFS: ${ipfsHash}`);

      // Download from IPFS
      const chunks: Uint8Array[] = [];
      for await (const chunk of this.client.cat(ipfsHash)) {
        chunks.push(chunk);
      }

      const data = Buffer.concat(chunks).toString();
      const fileData = JSON.parse(data);

      // Decrypt the content
      const decryptedContent = this.decryptData(fileData.content, decryptionKey);
      const content = Buffer.from(decryptedContent, 'base64');

      logger.info(`Evidence downloaded and decrypted from IPFS: ${ipfsHash}`);
      return {
        filename: fileData.filename,
        contentType: fileData.contentType,
        content
      };

    } catch (error) {
      logger.error('Failed to download evidence from IPFS:', error);
      throw new Error('Evidence download failed');
    }
  }

  /**
   * Pin content to ensure it stays available
   */
  public async pinContent(ipfsHash: string): Promise<void> {
    if (!this.isInitialized || !this.client) {
      throw new Error('IPFS Service not initialized');
    }

    try {
      await this.client.pin.add(ipfsHash);
      logger.info(`Content pinned to IPFS: ${ipfsHash}`);
    } catch (error) {
      logger.error('Failed to pin content to IPFS:', error);
      throw new Error('IPFS pin failed');
    }
  }

  /**
   * Unpin content to free up space
   */
  public async unpinContent(ipfsHash: string): Promise<void> {
    if (!this.isInitialized || !this.client) {
      throw new Error('IPFS Service not initialized');
    }

    try {
      await this.client.pin.rm(ipfsHash);
      logger.info(`Content unpinned from IPFS: ${ipfsHash}`);
    } catch (error) {
      logger.error('Failed to unpin content from IPFS:', error);
      throw new Error('IPFS unpin failed');
    }
  }

  /**
   * Get IPFS node information
   */
  public async getNodeInfo(): Promise<any> {
    if (!this.isInitialized || !this.client) {
      throw new Error('IPFS Service not initialized');
    }

    try {
      const [version, id, stats] = await Promise.all([
        this.client.version(),
        this.client.id(),
        this.client.stats.repo()
      ]);

      return {
        version: version.version,
        nodeId: id.id,
        addresses: id.addresses,
        repoStats: {
          numObjects: stats.numObjects,
          repoSize: stats.repoSize,
          storageMax: stats.storageMax
        }
      };
    } catch (error) {
      logger.error('Failed to get IPFS node info:', error);
      throw new Error('Failed to get node info');
    }
  }

  /**
   * Encrypt data using AES-256-GCM
   */
  private encryptData(data: string, customKey?: string): EncryptedContent {
    const key = customKey ? 
      crypto.scryptSync(customKey, 'salt', 32) : 
      this.encryptionKey;

    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipher('aes-256-gcm', key);
    cipher.setAAD(Buffer.from('SpeakSafe-Report', 'utf8'));

    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag();

    return {
      encryptedData: encrypted,
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex'),
      algorithm: 'aes-256-gcm'
    };
  }

  /**
   * Decrypt data using AES-256-GCM
   */
  private decryptData(encryptedContent: EncryptedContent, customKey?: string): string {
    const key = customKey ? 
      crypto.scryptSync(customKey, 'salt', 32) : 
      this.encryptionKey;

    const decipher = crypto.createDecipher('aes-256-gcm', key);
    decipher.setAAD(Buffer.from('SpeakSafe-Report', 'utf8'));
    decipher.setAuthTag(Buffer.from(encryptedContent.authTag, 'hex'));

    let decrypted = decipher.update(encryptedContent.encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }

  /**
   * Generate content hash for verification
   */
  public generateContentHash(content: string): string {
    return crypto.createHash('sha256').update(content).digest('hex');
  }

  /**
   * Validate IPFS hash format
   */
  public validateIPFSHash(hash: string): boolean {
    // Basic validation for IPFS CID
    const cidRegex = /^(Qm[1-9A-HJ-NP-Za-km-z]{44}|b[A-Za-z2-7]{58}|B[A-Z2-7]{58}|z[1-9A-HJ-NP-Za-km-z]{48}|F[0-9A-F]{50})$/;
    return cidRegex.test(hash);
  }

  /**
   * Get storage statistics
   */
  public async getStorageStats(): Promise<{
    totalUploads: number;
    totalSize: number;
    pinnedContent: number;
  }> {
    // This would be implemented with proper metrics tracking
    return {
      totalUploads: 0,
      totalSize: 0,
      pinnedContent: 0
    };
  }

  /**
   * Health check for IPFS service
   */
  public async healthCheck(): Promise<{ status: string; nodeInfo?: any }> {
    try {
      if (!this.isInitialized || !this.client) {
        return { status: 'unhealthy' };
      }

      const nodeInfo = await this.getNodeInfo();
      return {
        status: 'healthy',
        nodeInfo
      };
    } catch (error) {
      logger.error('IPFS health check failed:', error);
      return { status: 'unhealthy' };
    }
  }
}

export { IPFSService };
