import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Heart,
  Check,
  Wallet,
  AlertCircle,
  Loader,
  Gift
} from 'lucide-react';
import { useWriteContract } from 'wagmi';
import { parseEther } from 'viem';
import { CONTRACT_ADDRESSES, TREASURY_ABI } from '../../constants/contracts';
import donationService, { DonationTier } from '../../services/donationService';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (amount: number, currency: string) => void;
}

const DonationModal: React.FC<DonationModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [selectedTier, setSelectedTier] = useState<DonationTier | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [message, setMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'select' | 'confirm' | 'processing' | 'success'>('select');
  const [tiers, setTiers] = useState<DonationTier[]>([]);

  useEffect(() => {
    if (isOpen) {
      setTiers(donationService.getDonationTiers());
      // Auto-select the popular tier
      const popularTier = donationService.getDonationTiers().find(t => t.popular);
      if (popularTier) setSelectedTier(popularTier);
    }
  }, [isOpen]);

  const handleTierSelect = (tier: DonationTier) => {
    setSelectedTier(tier);
    setCustomAmount('');
    setError('');
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    setSelectedTier(null);
    setError('');
  };

  const getSelectedAmount = () => {
    if (selectedTier) return selectedTier.amount;
    return parseFloat(customAmount) || 0;
  };

  const getReportsSponsored = () => {
    const amount = getSelectedAmount();
    return Math.floor(amount * 7.5); // Approximately 7.5 reports per MATIC
  };

  const handleDonate = async () => {
    const amount = getSelectedAmount();
    
    if (amount <= 0) {
      setError('Please enter a valid donation amount');
      return;
    }

    if (amount < 0.1) {
      setError('Minimum donation is 0.1 MATIC');
      return;
    }

    setStep('confirm');
  };

  const { writeContractAsync: donateOnChain } = useWriteContract();

  const confirmDonation = async () => {
    setStep('processing');
    setIsProcessing(true);
    setError('');

    try {
      const amount = getSelectedAmount();
      
      // Real blockchain transaction
      await donateOnChain({
        address: CONTRACT_ADDRESSES.treasury,
        abi: TREASURY_ABI,
        functionName: 'donate',
        args: [
          0, // General purpose
          '0x0000000000000000000000000000000000000000000000000000000000000000', // No specific report
          message || '',
          isAnonymous,
          false, // Not recurring for now
          BigInt(0)
        ],
        value: parseEther(amount.toString())
      } as any);

      setStep('success');
      onSuccess?.(amount, 'MATIC');
      
    } catch (err: any) {
      console.error('Donation error:', err);
      setError(err.message || 'Failed to process donation. Please try again.');
      setStep('confirm');
    } finally {
      setIsProcessing(false);
    }
  };

  const resetModal = () => {
    setStep('select');
    setSelectedTier(tiers.find(t => t.popular) || null);
    setCustomAmount('');
    setMessage('');
    setIsAnonymous(false);
    setError('');
    setIsProcessing(false);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-gray-900 border border-white/20 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-accent-dark to-accent-mid rounded-full flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Sponsor Reports</h2>
                <p className="text-gray-400">Help others expose corruption</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          <div className="p-6">
            {step === 'select' && (
              <div className="space-y-6">
                {/* Donation Tiers */}
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Choose Your Impact</h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {tiers.map((tier) => (
                      <motion.div
                        key={tier.name}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleTierSelect(tier)}
                        className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          selectedTier?.name === tier.name
                            ? 'border-purple-500 bg-white/5'
                            : 'border-white/20 bg-white/5 hover:border-white/30'
                        }`}
                      >
                        {tier.popular && (
                          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                            <div className="bg-gradient-to-r from-accent-dark to-accent-mid text-white text-xs px-3 py-1 rounded-full font-semibold">
                              Most Popular
                            </div>
                          </div>
                        )}
                        
                        <div className="text-center">
                          <div className="text-2xl font-bold text-white mb-1">
                            {tier.amount} {tier.currency}
                          </div>
                          <div className="text-accent-bright font-semibold mb-2">{tier.name}</div>
                          <div className="text-green-400 text-sm mb-3">
                            Sponsors {tier.reportsSponsored} reports
                          </div>
                          
                          <div className="space-y-1">
                            {tier.benefits.slice(0, 2).map((benefit, index) => (
                              <div key={index} className="text-xs text-gray-300 flex items-center gap-1">
                                <Check className="w-3 h-3 text-green-400" />
                                {benefit}
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Custom Amount */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Or Enter Custom Amount</h3>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <input
                        type="number"
                        step="0.1"
                        min="0.1"
                        placeholder="Enter amount in MATIC"
                        value={customAmount}
                        onChange={(e) => handleCustomAmountChange(e.target.value)}
                        className="form-input"
                      />
                    </div>
                    <div className="flex items-center text-gray-300">
                      <span className="text-sm">
                        ≈ {getReportsSponsored()} reports
                      </span>
                    </div>
                  </div>
                </div>

                {/* Optional Message */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Add a Message (Optional)</h3>
                  <textarea
                    placeholder="Share why you're supporting transparency..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="form-textarea h-20"
                    maxLength={200}
                  />
                  <div className="text-xs text-gray-400 mt-1">
                    {message.length}/200 characters
                  </div>
                </div>

                {/* Privacy Option */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="anonymous"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="w-4 h-4 text-accent-bright bg-gray-700 border-gray-600 rounded focus:ring-accent-mid"
                  />
                  <label htmlFor="anonymous" className="text-gray-300">
                    Make this donation anonymous
                  </label>
                </div>

                {error && (
                  <div className="flex items-center gap-2 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-red-400" />
                    <span className="text-red-300 text-sm">{error}</span>
                  </div>
                )}

                <button
                  onClick={handleDonate}
                  disabled={getSelectedAmount() <= 0}
                  className="btn-primary w-full py-4 text-lg font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue to Confirmation
                </button>
              </div>
            )}

            {step === 'confirm' && (
              <div className="space-y-6">
                <div className="text-center">
                  <Gift className="w-16 h-16 text-accent-bright mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-2">Confirm Your Donation</h3>
                  <p className="text-gray-300">Review your donation details</p>
                </div>

                <div className="glass-card p-6 space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Amount:</span>
                    <span className="text-white font-semibold">
                      {getSelectedAmount()} MATIC
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Reports Sponsored:</span>
                    <span className="text-green-400 font-semibold">
                      {getReportsSponsored()} reports
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">USD Equivalent:</span>
                    <span className="text-gray-300">
                      ≈ ${(getSelectedAmount() * 0.85).toFixed(2)}
                    </span>
                  </div>
                  {message && (
                    <div>
                      <span className="text-gray-300">Message:</span>
                      <p className="text-white italic mt-1">"{message}"</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setStep('select')}
                    className="btn-secondary flex-1 py-3 rounded-xl"
                  >
                    Back
                  </button>
                  <button
                    onClick={confirmDonation}
                    disabled={isProcessing}
                    className="btn-primary flex-1 py-3 rounded-xl flex items-center justify-center gap-2"
                  >
                    <Wallet className="w-4 h-4" />
                    Confirm Donation
                  </button>
                </div>
              </div>
            )}

            {step === 'processing' && (
              <div className="text-center py-12">
                <Loader className="w-16 h-16 text-accent-bright mx-auto mb-4 animate-spin" />
                <h3 className="text-2xl font-bold text-white mb-2">Processing Donation</h3>
                <p className="text-gray-300">Please confirm the transaction in your wallet...</p>
              </div>
            )}

            {step === 'success' && (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-4">Thank You!</h3>
                <p className="text-xl text-gray-300 mb-6">
                  Your donation of {getSelectedAmount()} MATIC will sponsor {getReportsSponsored()} anonymous reports
                </p>
                <div className="glass-card p-6 mb-6">
                  <p className="text-gray-300">
                    You've just made it possible for {getReportsSponsored()} people to expose corruption 
                    without worrying about gas fees. Your contribution strengthens democracy and transparency worldwide.
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  className="btn-primary px-8 py-3 rounded-xl"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DonationModal;
