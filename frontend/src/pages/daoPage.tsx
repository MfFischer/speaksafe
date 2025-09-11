import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface Proposal {
  id: number;
  title: string;
  description: string;
  votesFor: number;
  votesAgainst: number;
  status: 'active' | 'passed' | 'rejected';
  timeLeft: string;
}

const DaoPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'proposals' | 'governance' | 'rewards'>('proposals');
  const [userTokens, setUserTokens] = useState(0);
  // const [isLoaded, setIsLoaded] = useState(false);

  const mockProposals: Proposal[] = [
    {
      id: 1,
      title: "Increase Reward for Verified Corruption Reports",
      description: "Proposal to increase token rewards for reports that lead to successful investigations from 100 to 150 tokens.",
      votesFor: 1250,
      votesAgainst: 340,
      status: 'active',
      timeLeft: '2 days'
    },
    {
      id: 2,
      title: "Add Multi-language Support for Southeast Asia",
      description: "Implement Bahasa Indonesia, Tagalog, and Nepali language support to better serve high-risk regions.",
      votesFor: 2100,
      votesAgainst: 150,
      status: 'passed',
      timeLeft: 'Completed'
    },
    {
      id: 3,
      title: "Enhanced AI Analysis for Report Categorization",
      description: "Deploy advanced AI to automatically categorize reports by type and severity for better escalation.",
      votesFor: 890,
      votesAgainst: 1200,
      status: 'rejected',
      timeLeft: 'Completed'
    }
  ];

  useEffect(() => {
    // setIsLoaded(true);
    // Simulate fetching user tokens
    setUserTokens(250);
  }, []);

  const handleVote = (proposalId: number, voteType: 'for' | 'against') => {
    console.log(`Voting ${voteType} on proposal ${proposalId}`);
    // This would interact with the smart contract
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Header */}
      <header className="bg-gray-900/90 backdrop-blur-sm py-4 px-6 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="text-white text-2xl font-bold">
            SpeakSafe
          </Link>
          <nav className="space-x-6">
            <Link to="/" className="text-white hover:text-purple-300 transition-colors font-medium">Home</Link>
            <Link to="/report" className="text-white hover:text-purple-300 transition-colors font-medium">Report</Link>
            <Link to="/dao" className="text-white hover:text-purple-300 transition-colors font-semibold">DAO</Link>
            <Link to="/donate" className="text-white hover:text-purple-300 transition-colors font-medium">Donate</Link>
            <Link to="/settings" className="text-white hover:text-purple-300 transition-colors font-medium">Settings</Link>
          </nav>
        </div>
      </header>

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
          </motion.div>

          {/* User Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="frosted-glass p-6 mb-8"
          >
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-white mb-2">{userTokens}</div>
                <div className="text-gray-300">Your Tokens</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-2">15</div>
                <div className="text-gray-300">Votes Cast</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-2">Gold</div>
                <div className="text-gray-300">Member Tier</div>
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
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
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
              {mockProposals.map((proposal, index) => (
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
                      <p className="text-blue-100 mb-4">{proposal.description}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      proposal.status === 'active' ? 'bg-green-500/20 text-green-300' :
                      proposal.status === 'passed' ? 'bg-blue-500/20 text-blue-300' :
                      'bg-red-500/20 text-red-300'
                    }`}>
                      {proposal.status.toUpperCase()}
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-4 items-center">
                    <div>
                      <div className="text-sm text-blue-100 mb-1">Votes For: {proposal.votesFor}</div>
                      <div className="text-sm text-blue-100">Votes Against: {proposal.votesAgainst}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-blue-100 mb-1">Time Left</div>
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
                  <div className="space-y-3 text-blue-100">
                    <div className="flex items-start space-x-3">
                      <div className="text-blue-300 mt-1">1.</div>
                      <div>Community members propose changes to the platform</div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="text-blue-300 mt-1">2.</div>
                      <div>Token holders vote on proposals using their tokens</div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="text-blue-300 mt-1">3.</div>
                      <div>Proposals with majority support are implemented</div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="text-blue-300 mt-1">4.</div>
                      <div>The community governs platform development</div>
                    </div>
                  </div>
                </div>
                
                <div className="frosted-glass p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Voting Power</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-blue-100">Your Tokens:</span>
                      <span className="text-white font-semibold">{userTokens}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-blue-100">Voting Power:</span>
                      <span className="text-white font-semibold">{userTokens} votes</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-blue-100">Member Since:</span>
                      <span className="text-white font-semibold">Jan 2024</span>
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
                  <p className="text-blue-100 text-sm mb-4">
                    Earn tokens for verified reports that lead to investigations
                  </p>
                  <div className="text-2xl font-bold text-white">100-500 tokens</div>
                </div>
                
                <div className="frosted-glass p-6 text-center">
                  <div className="text-3xl mb-4">🗳️</div>
                  <h3 className="text-lg font-semibold text-white mb-2">Voting Rewards</h3>
                  <p className="text-blue-100 text-sm mb-4">
                    Participate in governance and earn tokens for active voting
                  </p>
                  <div className="text-2xl font-bold text-white">5-10 tokens</div>
                </div>
                
                <div className="frosted-glass p-6 text-center">
                  <div className="text-3xl mb-4">👥</div>
                  <h3 className="text-lg font-semibold text-white mb-2">Community Rewards</h3>
                  <p className="text-blue-100 text-sm mb-4">
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
