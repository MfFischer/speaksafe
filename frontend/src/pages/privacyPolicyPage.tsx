import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Database, Mail, Calendar } from 'lucide-react';

const PrivacyPolicyPage: React.FC = () => {
  const lastUpdated = "January 15, 2024";

  const sections = [
    {
      id: "overview",
      title: "Privacy Overview",
      icon: <Shield className="w-6 h-6" />,
      content: `SpeakSafe is built on the principle of maximum privacy protection. We collect minimal data, 
      use advanced encryption, and employ zero-knowledge proofs to ensure your anonymity is mathematically guaranteed.`
    },
    {
      id: "data-collection",
      title: "Data We Collect",
      icon: <Database className="w-6 h-6" />,
      content: `We collect only essential data:
      • Report content and evidence (encrypted)
      • Anonymous usage analytics (no personal identifiers)
      • Technical logs for security (IP addresses not linked to reports)
      • Cookie preferences and consent records`
    },
    {
      id: "data-use",
      title: "How We Use Your Data",
      icon: <Eye className="w-6 h-6" />,
      content: `Your data is used exclusively for:
      • Processing and publishing anonymous reports
      • Improving platform security and functionality
      • Complying with legal obligations
      • Providing customer support (when requested)`
    },
    {
      id: "data-protection",
      title: "Data Protection Measures",
      icon: <Lock className="w-6 h-6" />,
      content: `We implement industry-leading security:
      • End-to-end encryption for all communications
      • Zero-knowledge proofs for anonymous reporting
      • Secure blockchain storage (immutable and decentralized)
      • Regular security audits and penetration testing`
    }
  ];

  return (
    <div className="min-h-screen bg-transparent">
      {/* Header */}
      <header className="bg-gray-900/90 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold text-accent-bright bg-clip-text text-transparent">
              SpeakSafe
            </Link>
            <nav className="hidden md:flex space-x-8">
              <Link to="/" className="text-white hover:text-text-primary transition-colors font-medium">Home</Link>
              <Link to="/contact" className="text-white hover:text-text-primary transition-colors font-medium">Contact</Link>
              <Link to="/faq" className="text-white hover:text-text-primary transition-colors font-medium">FAQ</Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full mb-6">
              <Shield className="w-5 h-5 text-text-primary" />
              <span className="text-text-primary font-medium">GDPR Compliant</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white bg-clip-text text-transparent">
              Privacy Policy
            </h1>
            <div className="flex items-center justify-center gap-2 text-gray-400 mb-8">
              <Calendar className="w-4 h-4" />
              <span>Last updated: {lastUpdated}</span>
            </div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Your privacy is our top priority. This policy explains how we protect your data and ensure complete anonymity.
            </p>
          </motion.div>

          {/* Quick Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-card p-8 mb-12 bg-gradient-to-r from-bg-tertiary/50 to-bg-accent/50 border-green-500/30"
          >
            <h2 className="text-2xl font-bold text-white mb-4">Privacy at a Glance</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="font-semibold text-white mb-2">Zero-Knowledge</h3>
                <p className="text-gray-300 text-sm">We cannot identify you, even if we wanted to</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Lock className="w-6 h-6 text-accent-bright" />
                </div>
                <h3 className="font-semibold text-white mb-2">Encrypted</h3>
                <p className="text-gray-300 text-sm">All data encrypted end-to-end</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Database className="w-6 h-6 text-accent-bright" />
                </div>
                <h3 className="font-semibold text-white mb-2">Minimal Data</h3>
                <p className="text-gray-300 text-sm">We collect only what's absolutely necessary</p>
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="space-y-8">
            {sections.map((section, index) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                className="glass-card p-8"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-white/5 rounded-full text-accent-bright">
                    {section.icon}
                  </div>
                  <h2 className="text-2xl font-bold text-white">{section.title}</h2>
                </div>
                <div className="text-gray-300 leading-relaxed whitespace-pre-line">
                  {section.content}
                </div>
              </motion.div>
            ))}

            {/* GDPR Rights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="glass-card p-8 bg-gradient-to-r from-bg-tertiary/50 to-bg-accent/50 border-white/10"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Your GDPR Rights</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Data Subject Rights</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li>• Right to access your personal data</li>
                    <li>• Right to rectification (correction)</li>
                    <li>• Right to erasure ("right to be forgotten")</li>
                    <li>• Right to restrict processing</li>
                    <li>• Right to data portability</li>
                    <li>• Right to object to processing</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">How to Exercise Rights</h3>
                  <p className="text-gray-300 mb-4">
                    Contact our Data Protection Officer at:
                  </p>
                  <div className="flex items-center gap-2 text-text-primary">
                    <Mail className="w-4 h-4" />
                    <a href="mailto:privacy@speaksafe.org" className="hover:text-text-primary">
                      privacy@speaksafe.org
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="glass-card p-8 text-center"
            >
              <h2 className="text-2xl font-bold text-white mb-4">Questions About Privacy?</h2>
              <p className="text-gray-300 mb-6">
                We're committed to transparency about our privacy practices. 
                If you have any questions or concerns, please don't hesitate to contact us.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/contact"
                  className="btn-primary px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-transform duration-300"
                >
                  Contact Privacy Team
                </Link>
                <Link
                  to="/gdpr-compliance"
                  className="btn-secondary px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-transform duration-300"
                >
                  GDPR Compliance Details
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
