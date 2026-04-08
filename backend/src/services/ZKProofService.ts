import * as snarkjs from 'snarkjs';
import * as circomlib from 'circomlib';
import * as fs from 'fs';
import * as path from 'path';
import { logger } from '@/utils/logger';
import crypto from 'crypto';

export interface ZKProofInput {
  identitySecret: string;
  reportContent: string;
  nonce: string;
  reporterData: string;
  nullifierHash: string;
  reportHash: string;
  timestamp: number;
  categoryCode: number;
  severityLevel: number;
}

export interface ZKProof {
  proof: any;
  publicSignals: string[];
}

export interface IdentityProofInput {
  identitySecret: string;
  idNumber: string;
  emailHash: string;
  phoneHash: string;
  biometricHash: string;
  birthDate: number;
  nationality: number;
  verificationLevel: number;
  currentTimestamp: number;
  challengeNonce: string;
}

class ZKProofService {
  private static instance: ZKProofService;
  private circuitPaths: { [key: string]: string };
  private keyPaths: { [key: string]: string };
  private isInitialized: boolean = false;

  private constructor() {
    this.circuitPaths = {
      anonymousReport: path.join(__dirname, '../../zk-circuits/build/anonymousReport.wasm'),
      identityProof: path.join(__dirname, '../../zk-circuits/build/identityProof.wasm'),
      anonymousVote: path.join(__dirname, '../../zk-circuits/build/anonymousVote.wasm')
    };

    this.keyPaths = {
      anonymousReport: path.join(__dirname, '../../zk-circuits/keys/anonymousReport_0001.zkey'),
      identityProof: path.join(__dirname, '../../zk-circuits/keys/identityProof_0001.zkey'),
      anonymousVote: path.join(__dirname, '../../zk-circuits/keys/anonymousVote_0001.zkey')
    };
  }

  public static getInstance(): ZKProofService {
    if (!ZKProofService.instance) {
      ZKProofService.instance = new ZKProofService();
    }
    return ZKProofService.instance;
  }

  public async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      // Verify all required files exist
      for (const [circuit, wasmPath] of Object.entries(this.circuitPaths)) {
        if (!fs.existsSync(wasmPath)) {
          throw new Error(`Circuit WASM file not found: ${wasmPath}`);
        }
        
        const keyPath = this.keyPaths[circuit]!;
        if (!fs.existsSync(keyPath)) {
          throw new Error(`Circuit key file not found: ${keyPath}`);
        }
      }

      this.isInitialized = true;
      logger.info('ZK Proof Service initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize ZK Proof Service:', error);
      throw error;
    }
  }

  public static async initialize(): Promise<void> {
    const instance = ZKProofService.getInstance();
    await instance.initialize();
  }

  /**
   * Generate anonymous report proof
   */
  public async generateReportProof(input: ZKProofInput): Promise<ZKProof> {
    if (!this.isInitialized) {
      throw new Error('ZK Proof Service not initialized');
    }

    try {
      logger.info('Generating anonymous report proof');

      // Prepare circuit inputs
      const circuitInputs = {
        identitySecret: this.stringToFieldElement(input.identitySecret),
        reportContent: this.stringToFieldElement(input.reportContent),
        nonce: this.stringToFieldElement(input.nonce),
        reporterData: this.stringToFieldElement(input.reporterData),
        nullifierHash: this.stringToFieldElement(input.nullifierHash),
        reportHash: this.stringToFieldElement(input.reportHash),
        timestamp: input.timestamp.toString(),
        categoryCode: input.categoryCode.toString(),
        severityLevel: input.severityLevel.toString()
      };

      // Generate proof
      const { proof, publicSignals } = await snarkjs.groth16.fullProve(
        circuitInputs,
        this.circuitPaths.anonymousReport,
        this.keyPaths.anonymousReport
      );

      logger.info('Anonymous report proof generated successfully');
      return { proof, publicSignals };

    } catch (error) {
      logger.error('Failed to generate anonymous report proof:', error);
      throw new Error('Proof generation failed');
    }
  }

  /**
   * Generate identity verification proof
   */
  public async generateIdentityProof(input: IdentityProofInput): Promise<ZKProof> {
    if (!this.isInitialized) {
      throw new Error('ZK Proof Service not initialized');
    }

    try {
      logger.info('Generating identity verification proof');

      // Prepare circuit inputs
      const circuitInputs = {
        identitySecret: this.stringToFieldElement(input.identitySecret),
        idNumber: this.stringToFieldElement(input.idNumber),
        emailHash: this.stringToFieldElement(input.emailHash),
        phoneHash: this.stringToFieldElement(input.phoneHash),
        biometricHash: this.stringToFieldElement(input.biometricHash),
        birthDate: input.birthDate.toString(),
        nationality: input.nationality.toString(),
        verificationLevel: input.verificationLevel.toString(),
        currentTimestamp: input.currentTimestamp.toString(),
        challengeNonce: this.stringToFieldElement(input.challengeNonce)
      };

      // Generate proof
      const { proof, publicSignals } = await snarkjs.groth16.fullProve(
        circuitInputs,
        this.circuitPaths.identityProof,
        this.keyPaths.identityProof
      );

      logger.info('Identity verification proof generated successfully');
      return { proof, publicSignals };

    } catch (error) {
      logger.error('Failed to generate identity verification proof:', error);
      throw new Error('Identity proof generation failed');
    }
  }

  /**
   * Verify anonymous report proof
   */
  public async verifyReportProof(proof: any, publicSignals: string[]): Promise<boolean> {
    if (!this.isInitialized) {
      throw new Error('ZK Proof Service not initialized');
    }

    try {
      logger.info('Verifying anonymous report proof');

      // Load verification key
      const vKeyPath = path.join(__dirname, '../../zk-circuits/keys/anonymousReport_verification_key.json');
      const vKey = JSON.parse(fs.readFileSync(vKeyPath, 'utf8'));

      // Verify proof
      const isValid = await snarkjs.groth16.verify(vKey, publicSignals, proof);

      logger.info(`Anonymous report proof verification: ${isValid ? 'VALID' : 'INVALID'}`);
      return isValid;

    } catch (error) {
      logger.error('Failed to verify anonymous report proof:', error);
      return false;
    }
  }

  /**
   * Verify identity proof
   */
  public async verifyIdentityProof(proof: any, publicSignals: string[]): Promise<boolean> {
    if (!this.isInitialized) {
      throw new Error('ZK Proof Service not initialized');
    }

    try {
      logger.info('Verifying identity proof');

      // Load verification key
      const vKeyPath = path.join(__dirname, '../../zk-circuits/keys/identityProof_verification_key.json');
      const vKey = JSON.parse(fs.readFileSync(vKeyPath, 'utf8'));

      // Verify proof
      const isValid = await snarkjs.groth16.verify(vKey, publicSignals, proof);

      logger.info(`Identity proof verification: ${isValid ? 'VALID' : 'INVALID'}`);
      return isValid;

    } catch (error) {
      logger.error('Failed to verify identity proof:', error);
      return false;
    }
  }

  /**
   * Generate anonymous ID from identity secret
   */
  public generateAnonymousId(identitySecret: string, nonce: string): string {
    const poseidon = circomlib.poseidon;
    const secretField = this.stringToFieldElement(identitySecret);
    const nonceField = this.stringToFieldElement(nonce);
    
    const anonymousId = poseidon([secretField, nonceField]);
    return anonymousId.toString();
  }

  /**
   * Generate nullifier hash to prevent double reporting
   */
  public generateNullifierHash(identitySecret: string, reportContent: string, timestamp: number): string {
    const poseidon = circomlib.poseidon;
    const secretField = this.stringToFieldElement(identitySecret);
    const contentField = this.stringToFieldElement(reportContent);
    const timestampField = BigInt(timestamp);
    
    const nullifierHash = poseidon([secretField, contentField, timestampField]);
    return nullifierHash.toString();
  }

  /**
   * Generate report hash
   */
  public generateReportHash(
    reportContent: string,
    categoryCode: number,
    severityLevel: number,
    timestamp: number
  ): string {
    const poseidon = circomlib.poseidon;
    const contentField = this.stringToFieldElement(reportContent);
    const categoryField = BigInt(categoryCode);
    const severityField = BigInt(severityLevel);
    const timestampField = BigInt(timestamp);
    
    const reportHash = poseidon([contentField, categoryField, severityField, timestampField]);
    return reportHash.toString();
  }

  /**
   * Hash sensitive data for privacy
   */
  public hashSensitiveData(data: string, salt?: string): string {
    const saltToUse = salt || crypto.randomBytes(32).toString('hex');
    const hash = crypto.createHash('sha256');
    hash.update(data + saltToUse);
    return hash.digest('hex');
  }

  /**
   * Generate secure random nonce
   */
  public generateNonce(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Generate identity secret from user data
   */
  public generateIdentitySecret(userData: {
    email?: string;
    phone?: string;
    idNumber?: string;
    biometricData?: string;
  }): string {
    const combinedData = [
      userData.email || '',
      userData.phone || '',
      userData.idNumber || '',
      userData.biometricData || ''
    ].join('|');

    const hash = crypto.createHash('sha256');
    hash.update(combinedData);
    return hash.digest('hex');
  }

  /**
   * Convert string to field element for circuit
   */
  private stringToFieldElement(str: string): bigint {
    const hash = crypto.createHash('sha256');
    hash.update(str);
    const hashHex = hash.digest('hex');
    
    // Convert to BigInt and ensure it's within field bounds
    const fieldElement = BigInt('0x' + hashHex);
    const fieldSize = BigInt('21888242871839275222246405745257275088548364400416034343698204186575808495617');
    
    return fieldElement % fieldSize;
  }

  /**
   * Validate proof structure
   */
  public validateProofStructure(proof: any): boolean {
    try {
      return (
        proof &&
        proof.pi_a &&
        proof.pi_b &&
        proof.pi_c &&
        Array.isArray(proof.pi_a) &&
        Array.isArray(proof.pi_b) &&
        Array.isArray(proof.pi_c) &&
        proof.pi_a.length === 3 &&
        proof.pi_b.length === 3 &&
        proof.pi_c.length === 3
      );
    } catch (error) {
      return false;
    }
  }

  /**
   * Get proof statistics
   */
  public getProofStats(): {
    totalProofsGenerated: number;
    totalProofsVerified: number;
    successRate: number;
  } {
    // This would be implemented with proper metrics tracking
    return {
      totalProofsGenerated: 0,
      totalProofsVerified: 0,
      successRate: 0
    };
  }
}

export { ZKProofService };
