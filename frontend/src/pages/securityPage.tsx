import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Server, Key, Zap, Globe, CheckCircle } from 'lucide-react';
import Header from '../components/layout/Header';

const SecurityPage: React.FC = () => {
  const securityFeatures = [
    {
      icon: <Shield className="w-8 h-8 text-accent-bright" />,
      title: "Zero-Knowledge Proofs",
      description: "Mathematical proofs that verify information without revealing the actual data, ensuring complete anonymity."
    },
    {
      icon: <Lock className="w-8 h-8 text-green-400" />,
      title: "End-to-End Encryption",
      description: "All data is encrypted before transmission and remains encrypted throughout the entire process."
    },
    {
      icon: <Server className="w-8 h-8 text-accent-bright" />,
      title: "Blockchain Immutability",
      description: "Reports are stored on decentralized blockchain networks, making them tamper-proof and permanent."
    },
    {
      icon: <Eye className="w-8 h-8 text-red-400" />,
      title: "No Identity Tracking",
      description: "We never collect, store, or track any personally identifiable information about reporters."
    },
    {
      icon: <Key className="w-8 h-8 text-yellow-400" />,
      title: "Cryptographic Hashing",
      description: "Advanced hashing algorithms ensure data integrity while maintaining complete anonymity."
    },
    {
      icon: <Zap className="w-8 h-8 text-orange-400" />,
      title: "Secure Infrastructure",
      description: "Military-grade security protocols protect our systems from unauthorized access."
    }
  ];

  return (
    <div className="min-h-screen bg-transparent">
      <Header />
      
      <div className="container mx-auto px-4 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-white/5 rounded-full mb-8"
            >
              <Shield className="w-10 h-10 text-accent-bright" />
            </motion.div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Security & Privacy
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Your anonymity and security are our top priorities. Learn how we protect whistleblowers with cutting-edge technology.
            </p>
          </div>

          {/* Security Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {securityFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.6 }}
                className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:bg-white/10 transition-all duration-300"
              >
                <div className="mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Detailed Security Information */}
          <div className="space-y-12">
            
            {/* How We Protect You */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8"
            >
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <Lock className="w-8 h-8 text-green-400" />
                How We Protect Your Identity
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-white">Before Submission</h3>
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>Your report is encrypted locally on your device</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>Zero-knowledge proof is generated without revealing content</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>No personal information is collected or stored</span>
                    </li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-white">During Transmission</h3>
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>End-to-end encryption protects data in transit</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>Decentralized routing prevents tracking</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>No IP addresses or metadata are logged</span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.section>

            {/* Technical Architecture */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8"
            >
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <Server className="w-8 h-8 text-accent-bright" />
                Technical Architecture
              </h2>
              <div className="space-y-6">
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <h3 className="text-xl font-bold text-white mb-3">Blockchain Layer</h3>
                  <p className="text-gray-300">
                    Reports are stored on multiple blockchain networks (Polygon, Ethereum) ensuring decentralization, 
                    immutability, and resistance to censorship. Smart contracts handle verification without exposing sensitive data.
                  </p>
                </div>
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <h3 className="text-xl font-bold text-white mb-3">Zero-Knowledge Protocol</h3>
                  <p className="text-gray-300">
                    We use advanced zk-SNARKs (Zero-Knowledge Succinct Non-Interactive Arguments of Knowledge) to prove 
                    the validity of reports without revealing their contents or the reporter's identity.
                  </p>
                </div>
                <div className="bg-green-600/10 rounded-xl p-6 border border-green-500/20">
                  <h3 className="text-xl font-bold text-white mb-3">Encryption Standards</h3>
                  <p className="text-gray-300">
                    All data is protected using AES-256 encryption, RSA-4096 key exchange, and SHA-256 hashing. 
                    These are the same standards used by governments and financial institutions worldwide.
                  </p>
                </div>
              </div>
            </motion.section>

            {/* Privacy Guarantees */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8"
            >
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <Globe className="w-8 h-8 text-accent-bright" />
                Our Privacy Guarantees
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-green-400">What We Never Collect</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li>• Names, email addresses, or contact information</li>
                    <li>• IP addresses or location data</li>
                    <li>• Browser fingerprints or device identifiers</li>
                    <li>• Cookies for tracking purposes</li>
                    <li>• Any personally identifiable information</li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-accent-bright">What We Protect</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li>• Complete anonymity of reporters</li>
                    <li>• Confidentiality of report contents</li>
                    <li>• Integrity of submitted evidence</li>
                    <li>• Immutability of blockchain records</li>
                    <li>• Resistance to censorship</li>
                  </ul>
                </div>
              </div>
            </motion.section>

            {/* Security Audits */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.8 }}
              className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8"
            >
              <h2 className="text-3xl font-bold text-white mb-6">Security Audits & Compliance</h2>
              <div className="space-y-4 text-gray-300">
                <p>
                  SpeakSafe undergoes regular security audits by independent third-party security firms to ensure 
                  the highest standards of protection for our users.
                </p>
                <div className="grid md:grid-cols-3 gap-6 mt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400 mb-2">SOC 2</div>
                    <div className="text-sm">Type II Compliant</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent-bright mb-2">ISO 27001</div>
                    <div className="text-sm">Certified</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent-bright mb-2">GDPR</div>
                    <div className="text-sm">Fully Compliant</div>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Contact Security Team */}
            <div className="bg-red-600/10 rounded-xl p-6 border border-red-500/20">
              <h3 className="text-xl font-bold text-white mb-3">Security Concerns?</h3>
              <p className="text-gray-300 mb-4">
                If you discover a security vulnerability or have concerns about our security practices, please contact our security team immediately:
              </p>
              <div className="space-y-2 text-gray-300">
                <p>🔒 Security Email: security@speaksafe.org</p>
                <p>🛡️ Bug Bounty Program: Available for responsible disclosure</p>
                <p>⚡ Emergency Response: 24/7 monitoring and response</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SecurityPage;
