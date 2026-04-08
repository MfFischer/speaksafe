import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Lock, Cpu, Globe, ArrowLeft, Download, BookOpen, ExternalLink } from 'lucide-react';
import Header from '../components/layout/Header';

const WhitepaperPage: React.FC = () => {
  const sections = [
    {
      id: "introduction",
      title: "1. Introduction",
      icon: <BookOpen className="w-6 h-6" />,
      content: `Safe whistleblowing is a cornerstone of a healthy and transparent society. However, current systems often fail to protect those who risk their lives and livelihoods to expose truth. SpeakSafe is a decentralized protocol engineered to provide absolute, mathematical anonymity via Zero-Knowledge Proofs while ensuring the immutability of evidence through blockchain technology.`
    },
    {
      id: "anonymity",
      title: "2. Absolute Anonymity",
      icon: <Lock className="w-6 h-6" />,
      content: `Traditional whistleblowing platforms rely on trust in the provider. SpeakSafe replaces trust with mathematics. By utilizing zk-SNARKs (Zero-Knowledge Succinct Non-Interactive Arguments of Knowledge), a whistleblower can prove their eligibility to submit a report without revealing any personally identifiable information. The system generates a cryptographic proof of the reporter's context (e.g., employee status) without leaking the specific identity.`
    },
    {
      id: "architecture",
      title: "3. Protocol Architecture",
      icon: <Cpu className="w-6 h-6" />,
      content: `The SpeakSafe architecture consists of three core layers:
      \n• Submission Layer: Client-side encryption ensures that data is never sent in plaintext.
      \n• Verification Layer: Decentralized nodes verify ZKPs and confirm report validity without accessing private data.
      \n• Consensus Layer: The Polygon blockchain provides a tamper-proof ledger where report hashes and metadata are permanently recorded.`
    },
    {
      id: "governance",
      title: "4. Decentralized Governance",
      icon: <Shield className="w-6 h-6" />,
      content: `Reports submitted to SpeakSafe are governed by a DAO (Decentralized Autonomous Organization). DAO members, who are vetted community participants, vote on the verification and escalation levels of reports. This prevents any single entity from suppressing critical information or malicious reporting.`
    },
    {
      id: "tokenomics",
      title: "5. Economic Sustainability",
      icon: <Globe className="w-6 h-6" />,
      content: `To prevent spam and ensure the network remains permissionless, SpeakSafe utilizes a sponsorship model. Users can donate to a global "Gas Tank" which covers the cost of blockchain transaction fees for whistleblowers who cannot afford them or wish to remain disconnected from a personal wallet.`
    }
  ];

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary pt-24 pb-20">
      <Header />
      
      {/* Background Decoration */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent-dark/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent-mid/10 blur-[100px] rounded-full" />
      </div>

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        {/* Navigation */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-12"
        >
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-text-secondary hover:text-accent-bright transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
        </motion.div>

        {/* Header */}
        <header className="mb-20 text-center lg:text-left">
            <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight"
          >
            SpeakSafe <span className="text-accent-mid">Protocol Whitepaper</span>
          </motion.h1>
        </header>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-sm text-text-muted"
          >
            <span className="flex items-center gap-1"><Shield className="w-4 h-4" /> Version 1.2.4</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span>Last Updated: March 2024</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span className="text-accent-mid font-semibold">CORTEX STABLE</span>
          </motion.div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          
          {/* Table of Contents - Sidebar */}
          <aside className="lg:col-span-1 border-r border-white/5 pr-8 hidden lg:block h-fit sticky top-32">
            <h4 className="text-white font-semibold mb-6 uppercase tracking-widest text-xs">Overview</h4>
            <nav className="space-y-4">
              {sections.map((section) => (
                <a 
                  key={section.id}
                  href={`#${section.id}`}
                  className="block text-sm text-text-secondary hover:text-accent-bright transition-colors border-l-2 border-transparent hover:border-accent-mid pl-4 py-1"
                >
                  {section.title.split('. ')[1]}
                </a>
              ))}
            </nav>
            <div className="mt-12 pt-12 border-t border-white/5">
              <button className="flex items-center gap-2 text-xs text-text-muted hover:text-white transition-colors">
                <Download className="w-4 h-4" />
                Download PDF
              </button>
            </div>
          </aside>

          {/* Paper Content */}
          <main className="lg:col-span-3 space-y-24">
            {sections.map((section, index) => (
              <motion.section 
                key={section.id} 
                id={section.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="scroll-mt-32 group"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-lg bg-bg-secondary flex items-center justify-center text-accent-mid border border-white/5 group-hover:border-accent-mid/30 transition-colors">
                    {section.icon}
                  </div>
                  <h2 className="text-2xl font-bold text-white group-hover:text-accent-bright transition-colors">
                    {section.title}
                  </h2>
                </div>
                <div className="prose prose-invert prose-slate max-w-none">
                  <p className="text-text-secondary leading-relaxed text-lg whitespace-pre-line">
                    {section.content}
                  </p>
                </div>
              </motion.section>
            ))}

            {/* Final CTA */}
            <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               className="frosted-glass p-8 text-center border border-accent-mid/20"
            >
              <h3 className="text-xl font-bold text-white mb-4">Have questions about the protocol?</h3>
              <p className="text-text-secondary mb-6">Join our developer community on GitHub or reach out via our secure channels.</p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/contact" className="btn-primary">Connect with Core Team</Link>
                <a href="https://github.com/speaksafe" target="_blank" rel="noopener noreferrer" className="btn-ghost flex items-center gap-2">
                  <ExternalLink className="w-4 h-4" />
                  View GitHub
                </a>
              </div>
            </motion.div>
          </main>

        </div>
      </div>
    </div>
  );
};

export default WhitepaperPage;
