import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '../components/layout/Header';

const MARKETING_STATS = {
  totalReports: 1247,
  resolvedReports: 892,
  totalDonations: "45,678 MATIC",
  activeMembers: 3456,
  disclaimer: "Statistics since beta launch in Q3 2023"
};

const HomePage: React.FC = () => {

  const features = [
    {
      title: "Anonymous Reporting",
      description: "Submit reports without revealing your identity using advanced zero-knowledge proofs.",
      icon: "🔒",
      delay: 0.1
    },
    {
      title: "Immutable Records",
      description: "Reports are cryptographically hashed and stored on blockchain ensuring they cannot be tampered with.",
      icon: "⛓️",
      delay: 0.2
    },
    {
      title: "Community Governance",
      description: "DAO-based decentralized decision making for transparent report escalation and governance.",
      icon: "🏛️",
      delay: 0.3
    },
    {
      title: "Reward System",
      description: "Earn exclusive tokens for verified whistleblowing and helping secure the community.",
      icon: "💰",
      delay: 0.4
    }
  ];

  const variants = {
    hidden: { opacity: 0, y: 30 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: custom, duration: 0.6, ease: "easeOut" }
    })
  };

  return (
    <div className="min-h-screen bg-bg-primary overflow-x-hidden pt-16">
      <Header />
      
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-[800px] bg-mesh-gradient opacity-60 pointer-events-none" />
      <div className="absolute -top-[300px] -right-[300px] w-[800px] h-[800px] rounded-full bg-bg-tertiary blur-[120px] pointer-events-none animate-pulse-glow" />
      <div className="absolute top-[400px] -left-[200px] w-[600px] h-[600px] rounded-full bg-bg-tertiary blur-[100px] pointer-events-none animate-pulse-glow" style={{ animationDelay: '2s'}} />

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6 max-w-7xl mx-auto z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
          
          <div className="flex-1 space-y-8 text-center lg:text-left">
            <motion.div
              custom={0.1} initial="hidden" animate="visible" variants={variants}
              className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-accent-mid/30 bg-accent-mid/10 text-accent-bright text-xs font-bold uppercase tracking-[0.2em] shadow-glass"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-bright opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-bright"></span>
              </span>
              The Global Standard for Anonymous Accountability
            </motion.div>

            <motion.h1
              custom={0.2} initial="hidden" animate="visible" variants={variants}
              className="text-6xl md:text-8xl font-black leading-tight tracking-tight text-white mb-2"
            >
              Speak Safely,<br/>
              <span className="bg-gradient-to-r from-accent-mid via-accent-bright to-white bg-[length:200%_auto] text-transparent bg-clip-text animate-shimmer italic px-4 ml-[-0.05em]">
                Protect Truth.
              </span>
            </motion.h1>

            <motion.p
              custom={0.3} initial="hidden" animate="visible" variants={variants}
              className="text-xl md:text-2xl text-text-secondary leading-relaxed max-w-2xl mx-auto lg:mx-0 font-medium border-l-4 border-accent-mid pl-6"
            >
              SpeakSafe is a decentralized infrastructure designed to protect whistleblowers, journalists, and activists. Leveraging zero-knowledge proofs and IPFS, we ensure your voice is heard without risking your safety.
            </motion.p>

            <motion.div
              custom={0.4} initial="hidden" animate="visible" variants={variants}
              className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start"
            >
              <Link to="/report" className="btn-primary text-lg px-10">
                Submit Report Anonymously
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
              </Link>
              <Link to="/dao" className="btn-secondary text-lg px-10">
                Explore Protocol
              </Link>
            </motion.div>
          </div>

          <motion.div 
            custom={0.5} initial="hidden" animate="visible" variants={variants}
            className="flex-1 w-full max-w-lg lg:max-w-none animate-float relative"
          >
             <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-transparent to-transparent z-10 pointer-events-none" />
             <img 
               src="/images/anonymous_whisperer.png" 
               alt="A mysterious, anonymous person whispering securely, symbolizing safe whistleblowing." 
               className="w-full h-auto object-cover rounded-3xl z-0 grayscale opacity-80"
             />
          </motion.div>
        
        </div>
      </section>

      {/* Vision Section */}
      <section className="relative py-24 px-6 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-3xl md:text-5xl font-bold text-white">Trust, but verify with <br/><span className="text-accent-bright">Zero-Knowledge.</span></h2>
              <p className="text-text-secondary text-lg leading-relaxed">
                Traditional whistleblowing platforms rely on trust in the organization. SpeakSafe replaces trust with mathematics. Using ZK-SNARKs, we verify that you have the right to report without revealing a single byte of your identity.
              </p>
              <ul className="space-y-4">
                {[
                  "Complete IP Masking & Meta-data Scrubbing",
                  "Decentralized Storage via IPFS Protocols",
                  "Immutable Evidence Trails on Polygon/Hardhat",
                  "DAO-Governed Report Escalation"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-white/80">
                    <div className="w-5 h-5 rounded-full bg-accent-mid/20 flex items-center justify-center border border-accent-mid/40">
                      <svg className="w-3 h-3 text-accent-bright" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg>
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="glass-card p-1 aspect-video relative group"
            >
              <div className="absolute inset-0 bg-accent-mid/10 group-hover:bg-accent-mid/20 transition-colors duration-500 rounded-2xl" />
              <img 
                src="/images/anonymous_whisperer.png" 
                alt="Technical illustration of SpeakSafe architecture" 
                className="w-full h-full object-cover rounded-2xl grayscale blur-[2px] hover:blur-none transition-all duration-700" 
              />
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="frosted-glass p-6 text-center max-w-xs">
                    <div className="text-2xl font-bold text-white mb-2">100% Secure</div>
                    <div className="text-xs text-text-secondary">All data is encrypted end-to-end and stored on decentralized nodes.</div>
                 </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative py-24 px-6 z-10 bg-bg-secondary/30 border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Architecture of Integrity</h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">We solve the "Single Point of Failure" problem in traditional whistleblowing using a multi-layered cryptographic stack.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Zero-Knowledge Proofs",
                description: "Submit verified reports without revealing your wallet address or IP, guaranteed by Circuit-level privacy.",
                icon: "🛡️"
              },
              {
                title: "IPFS Content Addressing",
                description: "Evidence files are hashed and distributed across thousands of nodes worldwide, making them un-deletable.",
                icon: "📦"
              },
              {
                title: "Decentralized DAO",
                description: "Community-driven oversight ensures that high-impact reports are escalated without centralized censorship.",
                icon: "⚖️"
              },
              {
                title: "Gas-Less Submission",
                description: "Sponsor-funded relayers allow whistleblowers to submit reports without needing to own crypto assets.",
                icon: "⚡"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-8 group"
              >
                <div className="w-14 h-14 rounded-xl bg-bg-accent flex items-center justify-center text-2xl mb-6 shadow-glass-inset border border-white/10 group-hover:border-accent-mid/50 transition-colors duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-accent-bright transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-text-secondary leading-relaxed text-sm">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Donation & Impact Section */}
      <section className="relative py-24 px-6 z-10 border-b border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col-reverse lg:flex-row items-center gap-16">
            
            <motion.div 
               initial={{ opacity: 0, x: -40 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.8 }}
               className="flex-1 w-full max-w-md animate-float-slow"
            >
              <img 
                 src="/images/anonymous_report.png" 
                 alt="Premium 3D art of an anonymous identity layered with data hashes." 
                 className="w-full h-auto rounded-3xl shadow-glass border border-white/10 grayscale opacity-90"
              />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="flex-1 space-y-6"
            >
              <h2 className="text-3xl md:text-5xl font-bold text-white pb-2 leading-tight">
                Empower Truth.<br/>
                <span className="text-accent-mid">Sponsor Gas Fees.</span>
              </h2>
              <p className="text-lg text-text-secondary leading-relaxed">
                Cost should never be a barrier to justice. Many whistleblowers lack the crypto needed to cover blockchain gas fees. By sponsoring a report, you cover the transaction costs, enabling critical truths to be permanently secured.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-4 py-4">
                <div className="glass-card p-5 border-l-4 border-l-accent-dark">
                   <div className="text-3xl font-extrabold text-white mb-1">0.01 <span className="text-sm font-medium text-text-muted">MATIC</span></div>
                   <div className="text-sm text-text-secondary">Average Gas Fee</div>
                </div>
                <div className="glass-card p-5 border-l-4 border-l-accent-mid">
                   <div className="text-3xl font-extrabold text-white mb-1">100%</div>
                   <div className="text-sm text-text-secondary">Anonymous Submissions</div>
                </div>
              </div>

              <div className="pt-4 flex gap-4">
                <Link to="/donate" className="btn-primary">
                  Sponsor Tranasctions
                </Link>
                <Link to="/report" className="btn-ghost">
                  Submit Free Report
                </Link>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Impact Stats Section */}
      <section className="relative py-20 px-6 z-10 bg-bg-tertiary/20 backdrop-blur-sm border-b border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-extrabold text-white mb-2">{MARKETING_STATS.totalReports.toLocaleString()}+</div>
              <div className="text-accent-mid font-semibold uppercase tracking-wider text-sm">Reports Submitted</div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-extrabold text-white mb-2">{MARKETING_STATS.resolvedReports.toLocaleString()}+</div>
              <div className="text-accent-mid font-semibold uppercase tracking-wider text-sm">Resolved Cases</div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-extrabold text-white mb-2">{MARKETING_STATS.totalDonations}</div>
              <div className="text-accent-mid font-semibold uppercase tracking-wider text-sm">Donations Received</div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-extrabold text-white mb-2">{MARKETING_STATS.activeMembers.toLocaleString()}+</div>
              <div className="text-accent-mid font-semibold uppercase tracking-wider text-sm">DAO Members</div>
            </motion.div>
          </div>
          <p className="text-center text-text-muted text-xs mt-12 italic">{MARKETING_STATS.disclaimer}</p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-6 z-10 mb-12">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="frosted-glass p-12 md:p-16 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-bg-accent/30 to-bg-tertiary/30 group-hover:from-bg-accent/50 group-hover:to-bg-tertiary/50 transition-colors duration-500" />
            
            <div className="relative z-10">
              <h2 className="text-4xl font-bold text-white mb-6">Take Action Securely</h2>
              <p className="text-xl text-text-secondary mb-10 max-w-2xl mx-auto">
                Ready to expose critical vulnerabilities or corruption? Our protocol guarantees your privacy through mathematics, not promises.
              </p>
              <Link
                to="/report"
                className="btn-primary text-xl px-10 py-5"
              >
                Access Reporting Interface
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
