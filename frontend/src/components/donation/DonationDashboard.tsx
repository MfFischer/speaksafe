import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Heart,
  Users,
  Shield,
  TrendingUp,
  Award,
  Clock,
  DollarSign,
  Globe
} from 'lucide-react';
import donationService, { DonationStats, SponsorshipImpact } from '../../services/donationService';

interface DonationDashboardProps {
  onDonateClick: () => void;
}

const DonationDashboard: React.FC<DonationDashboardProps> = ({ onDonateClick }) => {
  const [stats, setStats] = useState<DonationStats | null>(null);
  const [impact, setImpact] = useState<SponsorshipImpact | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, impactData] = await Promise.all([
          donationService.getDonationStats(),
          donationService.getSponsorshipImpact()
        ]);
        setStats(statsData);
        setImpact(impactData);
      } catch (error) {
        console.error('Failed to fetch donation data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="glass-card p-6 animate-pulse">
            <div className="h-4 bg-white/20 rounded w-3/4 mb-4"></div>
            <div className="h-8 bg-white/20 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-bg-tertiary border-white/5 px-4 py-2 rounded-full border border-white/10 mb-6">
          <Heart className="w-4 h-4 text-accent-bright" />
          <span className="text-text-primary font-medium">Community Powered</span>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Sponsor Anonymous Reporting
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
          Help others expose corruption without barriers. Your donation covers gas fees for those who can't afford crypto, making whistleblowing accessible to everyone.
        </p>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onDonateClick}
          className="btn-primary px-8 py-4 text-lg font-semibold rounded-xl inline-flex items-center gap-2"
        >
          <Heart className="w-5 h-5" />
          Donate Now
        </motion.button>
      </motion.div>

      {/* Impact Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <div className="glass-card p-6 text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <DollarSign className="w-6 h-6 text-white" />
          </div>
          <div className="text-3xl font-bold text-white mb-2">
            {stats?.totalDonated.toFixed(1)} MATIC
          </div>
          <div className="text-gray-300">Total Donated</div>
        </div>

        <div className="glass-card p-6 text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-accent-dark to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div className="text-3xl font-bold text-white mb-2">
            {stats?.reportsSponsored.toLocaleString()}
          </div>
          <div className="text-gray-300">Reports Sponsored</div>
        </div>

        <div className="glass-card p-6 text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-accent-dark to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div className="text-3xl font-bold text-white mb-2">
            {stats?.activeDonors.toLocaleString()}
          </div>
          <div className="text-gray-300">Active Donors</div>
        </div>

        <div className="glass-card p-6 text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Globe className="w-6 h-6 text-white" />
          </div>
          <div className="text-3xl font-bold text-white mb-2">
            {impact?.communitiesHelped}
          </div>
          <div className="text-gray-300">Communities Helped</div>
        </div>
      </motion.div>

      {/* Community Pool Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="glass-card p-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">Community Pool</h3>
            <p className="text-gray-300">
              Current balance available for sponsoring free reports
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-green-400 mb-1">
              {stats?.communityPoolBalance.toFixed(1)} MATIC
            </div>
            <div className="text-sm text-gray-400">
              ≈ ${((stats?.communityPoolBalance || 0) * 0.85).toFixed(0)} USD
            </div>
          </div>
        </div>

        {/* Pool Usage Visualization */}
        <div className="space-y-4">
          <div className="flex justify-between text-sm text-gray-300">
            <span>Pool Usage This Month</span>
            <span>73% of capacity</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '73%' }}
              transition={{ duration: 1, delay: 0.6 }}
              className="bg-gradient-to-r from-green-500 to-accent-mid h-3 rounded-full"
            />
          </div>
          <div className="flex justify-between text-xs text-gray-400">
            <span>0 MATIC</span>
            <span>200 MATIC capacity</span>
          </div>
        </div>
      </motion.div>

      {/* Recent Donations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="glass-card p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="w-6 h-6 text-accent-bright" />
          <h3 className="text-2xl font-bold text-white">Recent Donations</h3>
        </div>

        <div className="space-y-4">
          {stats?.recentDonations.map((donation, index) => (
            <motion.div
              key={donation.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
              className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-r from-accent-dark to-accent-mid rounded-full flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-white font-semibold">
                    {donation.amount} {donation.currency}
                  </div>
                  {donation.message && (
                    <div className="text-gray-300 text-sm italic">
                      "{donation.message}"
                    </div>
                  )}
                  <div className="text-gray-400 text-xs flex items-center gap-2">
                    <Clock className="w-3 h-3" />
                    {formatTimeAgo(donation.timestamp)}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-green-400 font-semibold">
                  +{donation.reportsSponsored} reports
                </div>
                <div className="text-gray-400 text-sm">sponsored</div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="glass-card p-8 text-center bg-gradient-to-r from-bg-tertiary/50 to-bg-accent/50 border-t border-white/5 border-white/10"
      >
        <Award className="w-16 h-16 text-accent-bright mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-white mb-4">
          Become a Transparency Champion
        </h3>
        <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
          Every donation, no matter how small, helps someone speak truth to power. 
          Join our community of transparency advocates and make corruption harder to hide.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onDonateClick}
          className="btn-primary px-8 py-4 text-lg font-semibold rounded-xl"
        >
          Start Donating
        </motion.button>
      </motion.div>
    </div>
  );
};

export default DonationDashboard;
