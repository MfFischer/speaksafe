// Donation Service for SpeakSafe
// Handles community donations and sponsored reporting

export interface DonationStats {
  totalDonated: number;
  reportsSponsored: number;
  activeDonors: number;
  communityPoolBalance: number;
  averageDonation: number;
  recentDonations: RecentDonation[];
}

export interface RecentDonation {
  id: string;
  amount: number;
  currency: 'MATIC' | 'POLY' | 'ETH';
  timestamp: Date;
  donorAddress?: string; // Optional for anonymous donations
  message?: string;
  reportsSponsored: number;
}

export interface DonationTier {
  name: string;
  amount: number;
  currency: 'MATIC' | 'POLY' | 'ETH';
  reportsSponsored: number;
  benefits: string[];
  popular?: boolean;
}

export interface SponsorshipImpact {
  totalReportsEnabled: number;
  corruptionExposed: number;
  communitiesHelped: number;
  averageGasCost: number;
}

class DonationService {
  private readonly API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001';
  
  // Predefined donation tiers
  getDonationTiers(): DonationTier[] {
    return [
      {
        name: 'Supporter',
        amount: 1,
        currency: 'MATIC',
        reportsSponsored: 5,
        benefits: [
          'Sponsor 5 anonymous reports',
          'Community supporter badge',
          'Monthly impact report'
        ]
      },
      {
        name: 'Advocate',
        amount: 5,
        currency: 'MATIC',
        reportsSponsored: 30,
        benefits: [
          'Sponsor 30 anonymous reports',
          'Priority support',
          'Quarterly governance voting',
          'Advocate badge'
        ],
        popular: true
      },
      {
        name: 'Champion',
        amount: 10,
        currency: 'MATIC',
        reportsSponsored: 75,
        benefits: [
          'Sponsor 75 anonymous reports',
          'VIP community access',
          'Monthly governance calls',
          'Champion badge',
          'Custom impact dashboard'
        ]
      },
      {
        name: 'Guardian',
        amount: 25,
        currency: 'MATIC',
        reportsSponsored: 200,
        benefits: [
          'Sponsor 200 anonymous reports',
          'Guardian council membership',
          'Direct platform feedback channel',
          'Guardian badge',
          'Annual recognition'
        ]
      }
    ];
  }

  // Get current donation statistics
  async getDonationStats(): Promise<DonationStats> {
    try {
      // In a real implementation, this would fetch from your backend
      // For demo purposes, returning mock data
      return {
        totalDonated: 2847.5,
        reportsSponsored: 12450,
        activeDonors: 1834,
        communityPoolBalance: 156.8,
        averageDonation: 3.2,
        recentDonations: [
          {
            id: '1',
            amount: 10,
            currency: 'MATIC',
            timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
            message: 'For transparency in government',
            reportsSponsored: 75
          },
          {
            id: '2',
            amount: 2,
            currency: 'MATIC',
            timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
            reportsSponsored: 12
          },
          {
            id: '3',
            amount: 5,
            currency: 'MATIC',
            timestamp: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
            message: 'Keep fighting corruption!',
            reportsSponsored: 30
          }
        ]
      };
    } catch (error) {
      console.error('Failed to fetch donation stats:', error);
      throw error;
    }
  }

  // Get sponsorship impact metrics
  async getSponsorshipImpact(): Promise<SponsorshipImpact> {
    try {
      return {
        totalReportsEnabled: 12450,
        corruptionExposed: 847,
        communitiesHelped: 156,
        averageGasCost: 0.02 // in MATIC
      };
    } catch (error) {
      console.error('Failed to fetch sponsorship impact:', error);
      throw error;
    }
  }

  // Process donation (would integrate with Web3 wallet)
  async processDonation(
    amount: number, 
    currency: 'MATIC' | 'POLY' | 'ETH',
    message?: string,
    isAnonymous: boolean = false
  ): Promise<{ success: boolean; transactionHash?: string; error?: string }> {
    try {
      // In a real implementation, this would:
      // 1. Connect to user's wallet
      // 2. Create transaction
      // 3. Submit to blockchain
      // 4. Update backend records
      
      // Simulate transaction processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock success response
      return {
        success: true,
        transactionHash: '0x' + Math.random().toString(16).substr(2, 64)
      };
    } catch (error) {
      console.error('Donation processing failed:', error);
      return {
        success: false,
        error: 'Transaction failed. Please try again.'
      };
    }
  }

  // Check if user can submit free report
  async canSubmitFreeReport(userAddress?: string): Promise<{
    canSubmit: boolean;
    remainingFreeReports?: number;
    nextResetTime?: Date;
  }> {
    try {
      // In real implementation, check user's free report quota
      return {
        canSubmit: true,
        remainingFreeReports: 3,
        nextResetTime: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now
      };
    } catch (error) {
      console.error('Failed to check free report eligibility:', error);
      return { canSubmit: false };
    }
  }

  // Format currency amounts
  formatCurrency(amount: number, currency: 'MATIC' | 'POLY' | 'ETH'): string {
    return `${amount.toFixed(2)} ${currency}`;
  }

  // Calculate USD equivalent (would fetch real exchange rates)
  async getUSDEquivalent(amount: number, currency: 'MATIC' | 'POLY' | 'ETH'): Promise<number> {
    const mockRates = {
      'MATIC': 0.85,
      'POLY': 0.85,
      'ETH': 2400
    };
    
    return amount * mockRates[currency];
  }

  // Get donation leaderboard (anonymous)
  async getDonationLeaderboard(): Promise<Array<{
    rank: number;
    amount: number;
    currency: string;
    reportsSponsored: number;
    badge: string;
  }>> {
    return [
      { rank: 1, amount: 150, currency: 'MATIC', reportsSponsored: 1125, badge: 'Guardian' },
      { rank: 2, amount: 89, currency: 'MATIC', reportsSponsored: 667, badge: 'Champion' },
      { rank: 3, amount: 67, currency: 'MATIC', reportsSponsored: 502, badge: 'Champion' },
      { rank: 4, amount: 45, currency: 'MATIC', reportsSponsored: 337, badge: 'Advocate' },
      { rank: 5, amount: 32, currency: 'MATIC', reportsSponsored: 240, badge: 'Advocate' }
    ];
  }
}

export default new DonationService();
