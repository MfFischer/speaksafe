import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, HelpCircle, Shield, Lock, Users, Zap } from 'lucide-react';

interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  icon: React.ReactNode;
}

const faqData: FAQItem[] = [
  {
    id: '1',
    category: 'Getting Started',
    question: 'What is SpeakSafe and how does it work?',
    answer: 'SpeakSafe is a revolutionary whistleblowing platform that uses blockchain technology and zero-knowledge proofs to ensure complete anonymity. You can report corruption, fraud, or misconduct without revealing your identity, even to us.',
    icon: <HelpCircle className="w-5 h-5" />
  },
  {
    id: '2',
    category: 'Getting Started',
    question: 'Do I need cryptocurrency to submit a report?',
    answer: 'No! Thanks to our community donation system, you can submit reports completely free. Our generous community sponsors gas fees for users who don\'t have crypto access.',
    icon: <Users className="w-5 h-5" />
  },
  {
    id: '3',
    category: 'Privacy & Security',
    question: 'How anonymous am I really?',
    answer: 'Completely anonymous. We use zero-knowledge proofs and blockchain technology to ensure that even we cannot trace reports back to you. Your identity is mathematically protected.',
    icon: <Shield className="w-5 h-5" />
  },
  {
    id: '4',
    category: 'Privacy & Security',
    question: 'What data do you collect about me?',
    answer: 'We collect minimal data: only what\'s necessary for the report (content, evidence) and basic analytics (anonymized). We never collect personal identifiers, IP addresses are not logged with reports, and all data is encrypted.',
    icon: <Lock className="w-5 h-5" />
  },
  {
    id: '5',
    category: 'Technical',
    question: 'What blockchain do you use?',
    answer: 'We use Polygon (MATIC) for fast, low-cost transactions. This ensures reports are processed quickly while maintaining security and decentralization.',
    icon: <Zap className="w-5 h-5" />
  },
  {
    id: '6',
    category: 'Technical',
    question: 'Can reports be deleted or censored?',
    answer: 'No. Once submitted to the blockchain, reports are immutable and cannot be deleted, modified, or censored by anyone - including us. This ensures permanent transparency.',
    icon: <Shield className="w-5 h-5" />
  },
  {
    id: '7',
    category: 'Legal & Compliance',
    question: 'Is this legal?',
    answer: 'Yes. Whistleblowing is protected by law in most jurisdictions. We comply with GDPR, provide legal disclaimers, and operate within established legal frameworks for transparency platforms.',
    icon: <Shield className="w-5 h-5" />
  },
  {
    id: '8',
    category: 'Legal & Compliance',
    question: 'What if I report something false?',
    answer: 'False reports are discouraged and may have legal consequences. We provide clear guidelines and encourage users to verify information. The immutable nature of blockchain means false reports cannot be hidden.',
    icon: <HelpCircle className="w-5 h-5" />
  },
  {
    id: '9',
    category: 'Community & Donations',
    question: 'How does the donation system work?',
    answer: 'Community members can donate MATIC to sponsor gas fees for others. Donations go into a community pool that automatically covers transaction costs for free reports.',
    icon: <Users className="w-5 h-5" />
  },
  {
    id: '10',
    category: 'Community & Donations',
    question: 'Can I donate anonymously?',
    answer: 'Yes! You can choose to donate anonymously. We also offer different donation tiers with various benefits for those who want recognition.',
    icon: <Users className="w-5 h-5" />
  }
];

const categories = ['All', 'Getting Started', 'Privacy & Security', 'Technical', 'Legal & Compliance', 'Community & Donations'];

const FAQPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [openItems, setOpenItems] = useState<string[]>([]);

  const filteredFAQs = activeCategory === 'All' 
    ? faqData 
    : faqData.filter(item => item.category === activeCategory);

  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Header */}
      <header className="bg-gray-900/90 backdrop-blur-sm border-b border-purple-500/30 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              SpeakSafe
            </Link>
            <nav className="hidden md:flex space-x-8">
              <Link to="/" className="text-white hover:text-purple-300 transition-colors font-medium">Home</Link>
              <Link to="/report" className="text-white hover:text-purple-300 transition-colors font-medium">Report</Link>
              <Link to="/dao" className="text-white hover:text-purple-300 transition-colors font-medium">DAO</Link>
              <Link to="/donate" className="text-white hover:text-purple-300 transition-colors font-medium">Donate</Link>
              <Link to="/faq" className="text-white hover:text-purple-300 transition-colors font-semibold">FAQ</Link>
              <Link to="/settings" className="text-white hover:text-purple-300 transition-colors font-medium">Settings</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 bg-purple-500/20 px-4 py-2 rounded-full mb-6">
              <HelpCircle className="w-5 h-5 text-purple-300" />
              <span className="text-purple-300 font-medium">Frequently Asked Questions</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
              Got Questions?
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Find answers to common questions about SpeakSafe, our technology, privacy protection, and how to get started with anonymous reporting.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="px-6 mb-12">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-4 mb-8"
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                  activeCategory === category
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
                }`}
              >
                {category}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ Items */}
      <section className="px-6 pb-20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-4"
          >
            {filteredFAQs.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="glass-card overflow-hidden"
              >
                <button
                  onClick={() => toggleItem(item.id)}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-purple-400">
                      {item.icon}
                    </div>
                    <div>
                      <div className="text-sm text-purple-300 mb-1">{item.category}</div>
                      <h3 className="text-lg font-semibold text-white">{item.question}</h3>
                    </div>
                  </div>
                  <div className="text-purple-400">
                    {openItems.includes(item.id) ? <ChevronUp /> : <ChevronDown />}
                  </div>
                </button>
                
                <AnimatePresence>
                  {openItems.includes(item.id) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-0">
                        <div className="pl-9 text-gray-300 leading-relaxed">
                          {item.answer}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-gradient-to-r from-purple-600/10 to-blue-600/10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="glass-card p-8"
          >
            <h2 className="text-3xl font-bold text-white mb-4">Still Have Questions?</h2>
            <p className="text-gray-300 mb-6">
              Can't find what you're looking for? Our community and support team are here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="btn-primary px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-transform duration-300"
              >
                Contact Support
              </Link>
              <Link
                to="/how-it-works"
                className="btn-secondary px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-transform duration-300"
              >
                How It Works
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default FAQPage;
