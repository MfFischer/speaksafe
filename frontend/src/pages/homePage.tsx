import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const HomePage: React.FC = () => {

  const features = [
    {
      title: "Anonymous Reporting",
      description: "Submit reports without revealing your identity using zero-knowledge proofs",
      icon: "🔒"
    },
    {
      title: "Immutable Records",
      description: "Reports are stored on blockchain ensuring they cannot be tampered with",
      icon: "⛓️"
    },
    {
      title: "Community Governance",
      description: "DAO-based decision making for report escalation and platform governance",
      icon: "🏛️"
    },
    {
      title: "Reward System",
      description: "Earn tokens for verified and actionable reports",
      icon: "💰"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative">
      {/* Header */}
      <header className="bg-gray-900/90 backdrop-blur-sm fixed w-full top-0 z-50 py-4 px-6 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-white text-2xl font-bold"
          >
            SpeakSafe
          </motion.div>
          <motion.nav
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-x-6"
          >
            <Link to="/" className="text-white hover:text-purple-300 transition-colors font-medium">Home</Link>
            <Link to="/report" className="text-white hover:text-purple-300 transition-colors font-medium">Report</Link>
            <Link to="/dao" className="text-white hover:text-purple-300 transition-colors font-medium">DAO</Link>
            <Link to="/donate" className="text-white hover:text-purple-300 transition-colors font-medium">Donate</Link>
            <Link to="/settings" className="text-white hover:text-purple-300 transition-colors font-medium">Settings</Link>
          </motion.nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center text-white">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent"
            style={{
              // Add subtle floating animation after initial load
              animation: 'subtleFloat 6s ease-in-out infinite 2s'
            }}
          >
            Speak Safely, Stay Secure
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-xl md:text-2xl mb-8 text-gray-300 leading-relaxed"
          >
            A decentralized platform for anonymous whistleblowing to combat corruption and protect those who speak truth to power.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link
              to="/report"
              className="btn-primary px-8 py-4 text-lg font-semibold rounded-xl hover:scale-105 transition-transform duration-300"
            >
              Submit a Report
            </Link>
            <button type="button" className="btn-secondary px-8 py-4 text-lg font-semibold rounded-xl hover:scale-105 transition-transform duration-300">
              Learn More
            </button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-3xl md:text-4xl font-bold text-center text-white mb-12"
          >
            Why Choose SpeakSafe?
          </motion.h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1 + index * 0.1 }}
                className="glass-card p-8 text-center hover:scale-105 transition-transform duration-300"
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-2xl">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-300 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.5 }}
              className="glass-card p-10 hover:scale-105 transition-transform duration-300"
            >
              <div className="text-5xl font-bold mb-3 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                $0.01
              </div>
              <div className="text-gray-300 text-lg">Average gas fee on Polygon</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.7 }}
              className="glass-card p-10 hover:scale-105 transition-transform duration-300"
            >
              <div className="text-5xl font-bold mb-3 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                100%
              </div>
              <div className="text-gray-300 text-lg">Anonymous reporting</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.9 }}
              className="glass-card p-10 hover:scale-105 transition-transform duration-300"
            >
              <div className="text-5xl font-bold mb-3 bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent">
                ∞
              </div>
              <div className="text-gray-300 text-lg">Immutable records</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Donation Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2.1 }}
            className="glass-card p-8 bg-gradient-to-r from-purple-600/10 to-blue-600/10 border-purple-500/30"
          >
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-purple-500/20 px-3 py-1 rounded-full mb-4">
                  <span className="text-purple-300 text-sm font-medium">🤝 Community Powered</span>
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">
                  Help Others Report Without Barriers
                </h2>
                <p className="text-gray-300 mb-6">
                  Many people want to expose corruption but can't afford crypto gas fees.
                  Your donation sponsors anonymous reports for those who need it most.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    to="/donate"
                    className="btn-primary px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-transform duration-300 inline-flex items-center justify-center gap-2"
                  >
                    💜 Sponsor Reports
                  </Link>
                  <Link
                    to="/report"
                    className="btn-secondary px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-transform duration-300 inline-flex items-center justify-center"
                  >
                    Submit Free Report
                  </Link>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl">
                  <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                    <span className="text-green-400 font-bold">1</span>
                  </div>
                  <div>
                    <div className="text-white font-semibold">1 MATIC = 7 Reports</div>
                    <div className="text-gray-400 text-sm">Covers gas fees for 7 anonymous reports</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <span className="text-blue-400 font-bold">12K</span>
                  </div>
                  <div>
                    <div className="text-white font-semibold">Reports Sponsored</div>
                    <div className="text-gray-400 text-sm">By our amazing community</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                    <span className="text-purple-400 font-bold">∞</span>
                  </div>
                  <div>
                    <div className="text-white font-semibold">Impact Created</div>
                    <div className="text-gray-400 text-sm">Transparency for everyone</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2.3 }}
            className="frosted-glass p-12"
          >
            <h2 className="text-3xl font-bold text-white mb-6">Ready to Make a Difference?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of whistleblowers who trust SpeakSafe to protect their identity while exposing corruption.
            </p>
            <Link
              to="/report"
              className="btn-primary px-8 py-4 text-xl font-semibold rounded-xl hover:scale-105 transition-transform duration-300 inline-block"
            >
              Start Reporting Now
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto text-center text-gray-400">
          <p>&copy; 2024 SpeakSafe. Empowering anonymous whistleblowing for a transparent world.</p>
          <div className="mt-4 space-x-6">
            <button type="button" className="hover:text-white transition-colors">Privacy Policy</button>
            <button type="button" className="hover:text-white transition-colors">Terms of Service</button>
            <button type="button" className="hover:text-white transition-colors">Contact</button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
