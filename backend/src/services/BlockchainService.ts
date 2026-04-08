import { ethers } from 'ethers';
import { logger } from '@/utils/logger';

// Contract ABIs (simplified for demo)
const REGISTRY_ABI = [
  "function submitReport(bytes32 reportId, bytes32 anonymousId, string ipfsHash, uint8 category, uint8 severity, bytes32 locationHash, bytes32 organizationHash, uint256 estimatedImpact, bool hasEvidence, bytes zkProof)",
  "function getReport(bytes32 reportId) view returns (tuple(bytes32 reportId, bytes32 anonymousId, string ipfsHash, uint8 category, uint8 severity, uint8 status, uint256 timestamp, uint256 lastUpdated, bytes32 locationHash, bytes32 organizationHash, uint256 estimatedImpact, bool hasEvidence, bytes zkProof, uint256 votesFor, uint256 votesAgainst, uint256 totalVotes, address assignedTo, bool isEscalated, uint256 escalatedAt))",
  "function voteOnReport(bytes32 reportId, bool support)",
  "function getTotalReports() view returns (uint256)"
];

const TREASURY_ABI = [
  "function donate(uint8 purpose, bytes32 sponsoredReportId, string message, bool isAnonymous, bool isRecurring, uint256 recurringInterval) payable",
  "function sponsorReport(bytes32 reportId) payable",
  "function getTreasuryBalance(address token) view returns (uint256)",
  "function getDonation(uint256 donationId) view returns (tuple(address donor, uint256 amount, address token, uint8 tier, uint8 purpose, bytes32 sponsoredReportId, uint256 timestamp, bool isRecurring, uint256 recurringInterval, uint256 nextDonationTime, bool isActive, string message, bool isAnonymous))"
];

const DAO_ABI = [
  "function proposeWithMetadata(address[] targets, uint256[] values, bytes[] calldatas, string description, uint8 proposalType, bytes32 relatedReportId, uint256 requestedAmount, address targetAddress, string justification, uint256 urgencyLevel, bool isEmergency) returns (uint256)",
  "function castVote(uint256 proposalId, uint8 support) returns (uint256)",
  "function getDAOStats() view returns (uint256, uint256, uint256, uint256)"
];

export interface ContractAddresses {
  registry: string;
  treasury: string;
  dao: string;
  token: string;
  timelock: string;
}

class BlockchainService {
  private static instance: BlockchainService;
  private provider: ethers.JsonRpcProvider | null = null;
  private signer: ethers.Wallet | null = null;
  private contracts: {
    registry?: ethers.Contract;
    treasury?: ethers.Contract;
    dao?: ethers.Contract;
  } = {};
  private isInitialized: boolean = false;
  private contractAddresses: ContractAddresses | null = null;

  private constructor() {}

  public static getInstance(): BlockchainService {
    if (!BlockchainService.instance) {
      BlockchainService.instance = new BlockchainService();
    }
    return BlockchainService.instance;
  }

  public async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      // Initialize provider
      const rpcUrl = process.env.POLYGON_RPC_URL || 'https://polygon-rpc.com';
      this.provider = new ethers.JsonRpcProvider(rpcUrl);

      // Initialize signer if private key is provided
      if (process.env.PRIVATE_KEY) {
        this.signer = new ethers.Wallet(process.env.PRIVATE_KEY, this.provider);
      }

      // Load contract addresses
      this.contractAddresses = {
        registry: process.env.CONTRACT_ADDRESSES_REPORT_REGISTRY || '',
        treasury: process.env.CONTRACT_ADDRESSES_DONATION_TREASURY || '',
        dao: process.env.CONTRACT_ADDRESSES_DAO_GOVERNANCE || '',
        token: process.env.CONTRACT_ADDRESSES_GOVERNANCE_TOKEN || '',
        timelock: process.env.CONTRACT_ADDRESSES_TIMELOCK || ''
      };

      // Initialize contracts if addresses are available
      if (this.contractAddresses.registry) {
        this.contracts.registry = new ethers.Contract(
          this.contractAddresses.registry,
          REGISTRY_ABI,
          this.signer || this.provider
        );
      }

      if (this.contractAddresses.treasury) {
        this.contracts.treasury = new ethers.Contract(
          this.contractAddresses.treasury,
          TREASURY_ABI,
          this.signer || this.provider
        );
      }

      if (this.contractAddresses.dao) {
        this.contracts.dao = new ethers.Contract(
          this.contractAddresses.dao,
          DAO_ABI,
          this.signer || this.provider
        );
      }

      // Test connection
      const network = await this.provider.getNetwork();
      logger.info(`Connected to blockchain network: ${network.name} (Chain ID: ${network.chainId})`);

      this.isInitialized = true;
      logger.info('Blockchain Service initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize Blockchain Service:', error);
      throw error;
    }
  }

  public static async initialize(): Promise<void> {
    const instance = BlockchainService.getInstance();
    await instance.initialize();
  }

  /**
   * Submit report to blockchain
   */
  public async submitReport(reportData: {
    reportId: string;
    anonymousId: string;
    ipfsHash: string;
    category: number;
    severity: number;
    locationHash: string;
    organizationHash: string;
    estimatedImpact: string;
    hasEvidence: boolean;
    zkProof: string;
  }): Promise<{ txHash: string; blockNumber: number }> {
    if (!this.contracts.registry) {
      throw new Error('Registry contract not initialized');
    }

    try {
      logger.info(`Submitting report to blockchain: ${reportData.reportId}`);

      const tx = await this.contracts.registry!.submitReport(
        reportData.reportId,
        reportData.anonymousId,
        reportData.ipfsHash,
        reportData.category,
        reportData.severity,
        reportData.locationHash,
        reportData.organizationHash,
        ethers.parseEther(reportData.estimatedImpact),
        reportData.hasEvidence,
        reportData.zkProof
      );

      const receipt = await tx.wait();
      
      logger.info(`Report submitted to blockchain: ${receipt.hash}`);
      return {
        txHash: receipt.hash,
        blockNumber: receipt.blockNumber
      };
    } catch (error) {
      logger.error('Failed to submit report to blockchain:', error);
      throw new Error('Blockchain submission failed');
    }
  }

  /**
   * Get report from blockchain
   */
  public async getReport(reportId: string): Promise<any> {
    if (!this.contracts.registry) {
      throw new Error('Registry contract not initialized');
    }

    try {
      const report = await this.contracts.registry!.getReport(reportId);
      return report;
    } catch (error) {
      logger.error('Failed to get report from blockchain:', error);
      throw new Error('Failed to retrieve report');
    }
  }

  /**
   * Vote on report
   */
  public async voteOnReport(
    reportId: string,
    support: boolean
  ): Promise<{ txHash: string; blockNumber: number }> {
    if (!this.contracts.registry) {
      throw new Error('Registry contract not initialized');
    }

    try {
      logger.info(`Voting on report: ${reportId}, support: ${support}`);

      const tx = await this.contracts.registry!.voteOnReport(reportId, support);
      const receipt = await tx.wait();

      logger.info(`Vote submitted: ${receipt.hash}`);
      return {
        txHash: receipt.hash,
        blockNumber: receipt.blockNumber
      };
    } catch (error) {
      logger.error('Failed to vote on report:', error);
      throw new Error('Voting failed');
    }
  }

  /**
   * Make donation
   */
  public async makeDonation(donationData: {
    amount: string;
    purpose: number;
    sponsoredReportId?: string;
    message?: string;
    isAnonymous: boolean;
    isRecurring: boolean;
    recurringInterval: number;
  }): Promise<{ txHash: string; blockNumber: number }> {
    if (!this.contracts.treasury) {
      throw new Error('Treasury contract not initialized');
    }

    try {
      logger.info(`Making donation: ${donationData.amount} MATIC`);

      const tx = await this.contracts.treasury!.donate(
        donationData.purpose,
        donationData.sponsoredReportId || ethers.ZeroHash,
        donationData.message || '',
        donationData.isAnonymous,
        donationData.isRecurring,
        donationData.recurringInterval,
        { value: ethers.parseEther(donationData.amount) }
      );

      const receipt = await tx.wait();

      logger.info(`Donation submitted: ${receipt.hash}`);
      return {
        txHash: receipt.hash,
        blockNumber: receipt.blockNumber
      };
    } catch (error) {
      logger.error('Failed to make donation:', error);
      throw new Error('Donation failed');
    }
  }

  /**
   * Sponsor report
   */
  public async sponsorReport(
    reportId: string,
    amount: string
  ): Promise<{ txHash: string; blockNumber: number }> {
    if (!this.contracts.treasury) {
      throw new Error('Treasury contract not initialized');
    }

    try {
      logger.info(`Sponsoring report: ${reportId} with ${amount} MATIC`);

      const tx = await this.contracts.treasury!.sponsorReport(reportId, {
        value: ethers.parseEther(amount)
      });

      const receipt = await tx.wait();

      logger.info(`Report sponsored: ${receipt.hash}`);
      return {
        txHash: receipt.hash,
        blockNumber: receipt.blockNumber
      };
    } catch (error) {
      logger.error('Failed to sponsor report:', error);
      throw new Error('Report sponsorship failed');
    }
  }

  /**
   * Get treasury balance
   */
  public async getTreasuryBalance(tokenAddress: string = ethers.ZeroAddress): Promise<string> {
    if (!this.contracts.treasury) {
      throw new Error('Treasury contract not initialized');
    }

    try {
      const balance = await this.contracts.treasury!.getTreasuryBalance(tokenAddress);
      return ethers.formatEther(balance);
    } catch (error) {
      logger.error('Failed to get treasury balance:', error);
      throw new Error('Failed to get balance');
    }
  }

  /**
   * Get DAO statistics
   */
  public async getDAOStats(): Promise<{
    totalProposals: number;
    totalMembers: number;
    totalVotes: number;
    treasuryBalance: number;
  }> {
    if (!this.contracts.dao) {
      throw new Error('DAO contract not initialized');
    }

    try {
      const stats = await this.contracts.dao!.getDAOStats();
      return {
        totalProposals: Number(stats[0]),
        totalMembers: Number(stats[1]),
        totalVotes: Number(stats[2]),
        treasuryBalance: Number(stats[3])
      };
    } catch (error) {
      logger.error('Failed to get DAO stats:', error);
      throw new Error('Failed to get DAO statistics');
    }
  }

  /**
   * Get current gas price
   */
  public async getGasPrice(): Promise<string> {
    if (!this.provider) {
      throw new Error('Provider not initialized');
    }

    try {
      const gasPrice = await this.provider.getFeeData();
      return ethers.formatUnits(gasPrice.gasPrice || 0, 'gwei');
    } catch (error) {
      logger.error('Failed to get gas price:', error);
      throw new Error('Failed to get gas price');
    }
  }

  /**
   * Get transaction receipt
   */
  public async getTransactionReceipt(txHash: string): Promise<any> {
    if (!this.provider) {
      throw new Error('Provider not initialized');
    }

    try {
      return await this.provider.getTransactionReceipt(txHash);
    } catch (error) {
      logger.error('Failed to get transaction receipt:', error);
      throw new Error('Failed to get transaction receipt');
    }
  }

  /**
   * Health check
   */
  public async healthCheck(): Promise<{ status: string; blockNumber?: number; gasPrice?: string }> {
    try {
      if (!this.provider) {
        return { status: 'unhealthy' };
      }

      const [blockNumber, gasPrice] = await Promise.all([
        this.provider.getBlockNumber(),
        this.getGasPrice()
      ]);

      return {
        status: 'healthy',
        blockNumber,
        gasPrice
      };
    } catch (error) {
      logger.error('Blockchain health check failed:', error);
      return { status: 'unhealthy' };
    }
  }

  /**
   * Get contract addresses
   */
  public getContractAddresses(): ContractAddresses | null {
    return this.contractAddresses;
  }
}

export { BlockchainService };
