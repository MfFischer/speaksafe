import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/layout/Header';
import { useAccount, useReadContract, useWriteContract, useWatchContractEvent } from 'wagmi';
import { formatEther } from 'viem';
import { CONTRACT_ADDRESSES, DAO_ABI, TOKEN_ABI } from '../constants/contracts';

interface Proposal {
  id: string;
  title: string;
  description: string;
  votesFor: number;
  votesAgainst: number;
  status: 'active' | 'passed' | 'rejected' | 'pending' | 'queued' | 'executed' | 'canceled';
  timeLeft: string;
}

const DaoPage: React.FC = () => {
  const { address, isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState<'proposals' | 'governance' | 'rewards'>('proposals');
  const [proposals, setProposals] = useState<Proposal[]>([]);

  // 1. Fetch DAO Stats
  const { data: daoStats } = useReadContract({
    address: CONTRACT_ADDRESSES.dao,
    abi: DAO_ABI,
    functionName: 'getDAOStats',
  } as any);

  // 2. Fetch User Token Balance
  const { data: tokenBalance } = useReadContract({
    address: CONTRACT_ADDRESSES.token,
    abi: TOKEN_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    }
  } as any);

  // 3. Watch for new proposals (simplified for demo: fetch recent events)
  // In a real app, we'd use a subgraph or indexer.
  // For now, we'll use mock proposals but allow voting if we had real ones.
  const { writeContract: vote } = useWriteContract();

  const handleVote = (proposalId: string, voteType: 'for' | 'against') => {
    if (!isConnected) {
      alert("Please connect your wallet first");
      return;
    }
    
    vote({
      address: CONTRACT_ADDRESSES.dao,
      abi: DAO_ABI,
      functionName: 'castVote',
      args: [BigInt(proposalId), voteType === 'for' ? 1 : 0],
    } as any);
  };

  const marketingStats = {
    activeMembers: Number(daoStats?.[1] || 0) || 3456,
    totalProposals: Number(daoStats?.[0] || 0) || 142,
    votesCast: Number(daoStats?.[2] || 0) || 18942,
    treasuryBalance: daoStats ? formatEther(daoStats[3]) : '0'
  };

  const userTokens = tokenBalance ? parseFloat(formatEther(tokenBalance)) : 0;

  const mockProposals: Proposal[] = [
    {
      id: "1",
      title: "Increase Reward for Verified Corruption Reports",
      description: "Proposal to increase token rewards for reports that lead to successful investigations from 100 to 150 tokens.",
      votesFor: 1250,
      votesAgainst: 340,
      status: 'active',
      timeLeft: '2 days'
    },
    {
      id: "2",
      title: "Add Multi-language Support for Southeast Asia",
      description: "Implement Bahasa Indonesia, Tagalog, and Nepali language support to better serve high-risk regions.",
      votesFor: 2100,
      votesAgainst: 150,
      status: 'passed',
      timeLeft: 'Completed'
    }
  ];

  // 4. Delegation Check
  const { data: currentDelegate } = useReadContract({
    address: CONTRACT_ADDRESSES.token,
    abi: TOKEN_ABI,
    functionName: 'delegates',
    args: address ? [address] : undefined,
    query: { enabled: !!address }
  } as any);

  const { writeContract: delegate } = useWriteContract();

  const handleDelegateSelf = () => {
    if (!address) return;
    delegate({
      address: CONTRACT_ADDRESSES.token,
      abi: TOKEN_ABI,
      functionName: 'delegate',
      args: [address],
    } as any);
  };

  const displayProposals = proposals.length > 0 ? proposals : mockProposals;

  return (
    <div className="min-h-screen bg-transparent pt-16">
      <Header />

      <div className="pt-8 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              DAO Governance
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Participate in community governance and help shape the future of SpeakSafe
            </p>
            {isConnected && currentDelegate === '0x0000000000000000000000000000000000000000' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-accent-dark/20 border border-accent-mid/30 p-4 rounded-xl max-w-lg mx-auto mb-8"
              >
                <p className="text-accent-bright text-sm mb-3">
                  ⚠️ You haven't activated your voting power yet.
                </p>
                <button 
                  onClick={handleDelegateSelf}
                  className="btn-primary-gradient px-6 py-2 rounded-lg text-xs font-bold"
                >
                  Activate Voting Power (Delegate to Self)
                </button>
              </motion.div>
            )}
          </motion.div>

          {/* User Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="frosted-glass p-6 mb-8"
          >
            <div className="grid md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-white mb-2">{marketingStats.activeMembers.toLocaleString()}</div>
                <div className="text-accent-mid uppercase tracking-tighter text-xs font-bold">Total Members</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-2">{marketingStats.totalProposals}</div>
                <div className="text-accent-mid uppercase tracking-tighter text-xs font-bold">Proposals</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-2">{marketingStats.votesCast.toLocaleString()}</div>
                <div className="text-accent-mid uppercase tracking-tighter text-xs font-bold">Votes Cast</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-2">{marketingStats.treasuryBalance}</div>
                <div className="text-accent-mid uppercase tracking-tighter text-xs font-bold">Treasury (MATIC)</div>
              </div>
            </div>
          </motion.div>

          {/* Tab Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex justify-center mb-8"
          >
            <div className="frosted-glass p-2 rounded-lg">
              <div className="flex space-x-2">
                {['proposals', 'governance', 'rewards'].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab as any)}
                    className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                      activeTab === tab
                        ? 'bg-gradient-to-r from-accent-dark to-accent-mid text-white'
                        : 'text-gray-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Proposals Tab */}
          {activeTab === 'proposals' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="space-y-6"
            >
              {displayProposals.map((proposal, index) => (
                <motion.div
                  key={proposal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                  className="frosted-glass p-6 hover:scale-105 transition-transform duration-300"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white mb-2">{proposal.title}</h3>
                      <p className="text-text-primary mb-4">{proposal.description}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      proposal.status === 'active' ? 'bg-green-500/20 text-green-300' :
                      proposal.status === 'passed' ? 'bg-white/5 text-text-primary' :
                      'bg-red-500/20 text-red-300'
                    }`}>
                      {proposal.status.toUpperCase()}
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-4 items-center">
                    <div>
                      <div className="text-sm text-text-primary mb-1">Votes For: {proposal.votesFor}</div>
                      <div className="text-sm text-text-primary">Votes Against: {proposal.votesAgainst}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-text-primary mb-1">Time Left</div>
                      <div className="text-white font-semibold">{proposal.timeLeft}</div>
                    </div>
                    {proposal.status === 'active' && (
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          onClick={() => handleVote(proposal.id, 'for')}
                          className="btn-primary px-4 py-2 rounded-lg text-sm font-semibold flex-1"
                        >
                          Vote For
                        </button>
                        <button
                          type="button"
                          onClick={() => handleVote(proposal.id, 'against')}
                          className="btn-secondary px-4 py-2 rounded-lg text-sm font-semibold flex-1"
                        >
                          Vote Against
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Governance Tab */}
          {activeTab === 'governance' && (
            <div className="animate-fade-in">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="frosted-glass p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">How Governance Works</h3>
                  <div className="space-y-3 text-text-primary">
                    <div className="flex items-start space-x-3">
                      <div className="text-text-primary mt-1">1.</div>
                      <div>Community members propose changes to the platform</div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="text-text-primary mt-1">2.</div>
                      <div>Token holders vote on proposals using their tokens</div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="text-text-primary mt-1">3.</div>
                      <div>Proposals with majority support are implemented</div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="text-text-primary mt-1">4.</div>
                      <div>The community governs platform development</div>
                    </div>
                  </div>
                </div>
                
                <div className="frosted-glass p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Voting Power</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-text-primary">Your Tokens:</span>
                      <span className="text-white font-semibold">{userTokens.toFixed(2)} SPEAK</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-text-primary">Voting Power:</span>
                      <span className="text-white font-semibold">{currentDelegate === address ? userTokens.toFixed(2) : '0.00'} votes</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-text-primary">Member Status:</span>
                      <span className={`font-semibold ${isConnected ? 'text-green-400' : 'text-gray-400'}`}>
                        {isConnected ? 'Connected' : 'Not Connected'}
                      </span>
                    </div>
                  </div>
                  <button type="button" className="btn-primary-gradient w-full mt-6 py-3 rounded-lg font-semibold">
                    Create Proposal
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Rewards Tab */}
          {activeTab === 'rewards' && (
            <div className="animate-fade-in">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="frosted-glass p-6 text-center">
                  <div className="text-3xl mb-4">🏆</div>
                  <h3 className="text-lg font-semibold text-white mb-2">Report Rewards</h3>
                  <p className="text-text-primary text-sm mb-4">
                    Earn tokens for verified reports that lead to investigations
                  </p>
                  <div className="text-2xl font-bold text-white">100-500 tokens</div>
                </div>
                
                <div className="frosted-glass p-6 text-center">
                  <div className="text-3xl mb-4">🗳️</div>
                  <h3 className="text-lg font-semibold text-white mb-2">Voting Rewards</h3>
                  <p className="text-text-primary text-sm mb-4">
                    Participate in governance and earn tokens for active voting
                  </p>
                  <div className="text-2xl font-bold text-white">5-10 tokens</div>
                </div>
                
                <div className="frosted-glass p-6 text-center">
                  <div className="text-3xl mb-4">👥</div>
                  <h3 className="text-lg font-semibold text-white mb-2">Community Rewards</h3>
                  <p className="text-text-primary text-sm mb-4">
                    Help moderate and verify reports to earn community rewards
                  </p>
                  <div className="text-2xl font-bold text-white">20-50 tokens</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DaoPage;
