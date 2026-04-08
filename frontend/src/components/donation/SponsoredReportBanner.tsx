import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Shield, Users, CheckCircle, AlertCircle } from 'lucide-react';
import donationService from '../../services/donationService';

interface SponsoredReportBannerProps {
  onSubmitFreeReport?: () => void;
  className?: string;
}

const SponsoredReportBanner: React.FC<SponsoredReportBannerProps> = ({ 
  onSubmitFreeReport, 
  className = '' 
}) => {
  const [canSubmitFree, setCanSubmitFree] = useState(false);
  const [remainingReports, setRemainingReports] = useState(0);
  const [communityPoolBalance, setCommunityPoolBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkEligibility = async () => {
      try {
        const [eligibility, stats] = await Promise.all([
          donationService.canSubmitFreeReport(),
          donationService.getDonationStats()
        ]);
        
        setCanSubmitFree(eligibility.canSubmit);
        setRemainingReports(eligibility.remainingFreeReports || 0);
        setCommunityPoolBalance(stats.communityPoolBalance);
      } catch (error) {
        console.error('Failed to check report eligibility:', error);
      } finally {
        setLoading(false);
      }
    };

    checkEligibility();
  }, []);

  if (loading) {
    return (
      <div className={`glass-card p-6 animate-pulse ${className}`}>
        <div className="h-4 bg-white/20 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-white/20 rounded w-1/2"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`glass-card p-6 border-l-4 border-l-purple-500 ${className}`}
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-gradient-to-r from-accent-dark to-accent-mid rounded-full flex items-center justify-center flex-shrink-0">
          <Heart className="w-6 h-6 text-white" />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-white">Community Sponsored Reporting</h3>
            {canSubmitFree && (
              <div className="flex items-center gap-1 bg-green-500/20 px-2 py-1 rounded-full">
                <CheckCircle className="w-3 h-3 text-green-400" />
                <span className="text-green-400 text-xs font-medium">Available</span>
              </div>
            )}
          </div>
          
          <p className="text-gray-300 mb-4">
            Don't have crypto? No problem! Our community has donated to cover gas fees for people like you. 
            Submit your report for free thanks to generous transparency advocates.
          </p>

          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-accent-bright" />
              <div>
                <div className="text-white font-semibold text-sm">12,450</div>
                <div className="text-gray-400 text-xs">Reports Sponsored</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-accent-bright" />
              <div>
                <div className="text-white font-semibold text-sm">1,834</div>
                <div className="text-gray-400 text-xs">Community Donors</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-pink-400" />
              <div>
                <div className="text-white font-semibold text-sm">
                  {communityPoolBalance.toFixed(1)} MATIC
                </div>
                <div className="text-gray-400 text-xs">Pool Balance</div>
              </div>
            </div>
          </div>

          {/* Action Section */}
          {canSubmitFree ? (
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={onSubmitFreeReport}
                className="btn-primary px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
              >
                <Shield className="w-4 h-4" />
                Submit Free Report
              </button>
              
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <span>You have {remainingReports} free reports remaining this month</span>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-3 p-4 bg-orange-500/20 border border-orange-500/30 rounded-xl">
              <AlertCircle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-orange-300 font-medium mb-1">
                  Free Report Limit Reached
                </div>
                <div className="text-orange-200 text-sm">
                  You've used your free reports for this month. The community pool will reset in 24 hours, 
                  or you can submit with your own crypto wallet.
                </div>
              </div>
            </div>
          )}

          {/* Community Message */}
          <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/10">
            <div className="text-xs text-gray-400 mb-1">Latest community message:</div>
            <div className="text-sm text-gray-300 italic">
              "Every voice matters in the fight against corruption. We're here to make sure yours is heard." 
              - Anonymous Donor
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SponsoredReportBanner;
