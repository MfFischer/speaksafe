import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Shield, 
  Zap, 
  Users, 
  CheckCircle, 
  ArrowRight, 
  Lock, 
  Eye, 
  Globe,
  PlayCircle,
  Lightbulb
} from 'lucide-react';

const HowItWorksPage: React.FC = () => {
  const [activeStep, setActiveStep] = useState(1);

  const steps = [
    {
      id: 1,
      title: "Write Your Report",
      description: "Describe the corruption, fraud, or misconduct you've witnessed. Include as much detail as possible.",
      icon: <FileText className="w-8 h-8" />,
      details: [
        "Use our secure, encrypted form",
        "Upload supporting documents or evidence",
        "No personal information required",
        "All data encrypted before transmission"
      ]
    },
    {
      id: 2,
      title: "Zero-Knowledge Proof",
      description: "Our system creates a mathematical proof that your report is valid without revealing your identity.",
      icon: <Lock className="w-8 h-8" />,
      details: [
        "Advanced cryptographic protection",
        "Your identity is mathematically hidden",
        "Even we cannot trace reports back to you",
        "Proof of authenticity without exposure"
      ]
    },
    {
      id: 3,
      title: "Blockchain Submission",
      description: "Your anonymous report is permanently recorded on the blockchain, making it immutable and transparent.",
      icon: <Zap className="w-8 h-8" />,
      details: [
        "Stored on Polygon blockchain",
        "Cannot be deleted or modified",
        "Publicly verifiable",
        "Decentralized and censorship-resistant"
      ]
    },
    {
      id: 4,
      title: "Community Impact",
      description: "Your report becomes part of a transparent database that helps expose corruption and protect society.",
      icon: <Users className="w-8 h-8" />,
      details: [
        "Searchable public database",
        "Helps journalists and investigators",
        "Creates accountability pressure",
        "Contributes to systemic change"
      ]
    }
  ];

  const features = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Complete Anonymity",
      description: "Your identity is protected by advanced cryptography. Even we cannot identify you."
    },
    {
      icon: <Eye className="w-6 h-6" />,
      title: "Full Transparency",
      description: "All reports are publicly accessible, creating maximum transparency and accountability."
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: "Immutable Records",
      description: "Once submitted, reports cannot be deleted, modified, or censored by anyone."
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Global Access",
      description: "Available worldwide, helping expose corruption across all borders and jurisdictions."
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
              <Link to="/report" className="text-white hover:text-text-primary transition-colors font-medium">Report</Link>
              <Link to="/dao" className="text-white hover:text-text-primary transition-colors font-medium">DAO</Link>
              <Link to="/donate" className="text-white hover:text-text-primary transition-colors font-medium">Donate</Link>
              <Link to="/faq" className="text-white hover:text-text-primary transition-colors font-medium">FAQ</Link>
              <Link to="/how-it-works" className="text-white hover:text-text-primary transition-colors font-semibold">How It Works</Link>
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
            <div className="inline-flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full mb-6">
              <Lightbulb className="w-5 h-5 text-text-primary" />
              <span className="text-text-primary font-medium">Simple & Secure</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white bg-clip-text text-transparent">
              How SpeakSafe Works
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Understanding our technology is simple. Protecting your identity while exposing corruption 
              has never been easier or more secure.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/report"
                className="btn-primary px-8 py-4 rounded-xl font-semibold hover:scale-105 transition-transform duration-300 inline-flex items-center gap-2"
              >
                <FileText className="w-5 h-5" />
                Submit Your First Report
              </Link>
              <button className="btn-secondary px-8 py-4 rounded-xl font-semibold hover:scale-105 transition-transform duration-300 inline-flex items-center gap-2">
                <PlayCircle className="w-5 h-5" />
                Watch Demo Video
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Step-by-Step Process */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">The Process</h2>
            <p className="text-xl text-gray-300">Four simple steps to secure, anonymous reporting</p>
          </motion.div>

          {/* Step Navigation */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {steps.map((step) => (
              <button
                key={step.id}
                onClick={() => setActiveStep(step.id)}
                className={`flex items-center gap-3 px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                  activeStep === step.id
                    ? 'bg-accent-mid text-white shadow-lg shadow-purple-600/30'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
                }`}
              >
                <div className={`p-2 rounded-full ${activeStep === step.id ? 'bg-white/20' : 'bg-white/5'}`}>
                  {step.icon}
                </div>
                <span className="hidden sm:block">Step {step.id}: {step.title}</span>
                <span className="sm:hidden">{step.id}</span>
              </button>
            ))}
          </div>

          {/* Active Step Details */}
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="glass-card p-8 mb-8"
          >
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-4 bg-white/5 rounded-full text-accent-bright">
                    {steps[activeStep - 1].icon}
                  </div>
                  <div>
                    <div className="text-text-primary text-sm font-medium">Step {activeStep}</div>
                    <h3 className="text-2xl font-bold text-white">{steps[activeStep - 1].title}</h3>
                  </div>
                </div>
                <p className="text-gray-300 text-lg mb-6">{steps[activeStep - 1].description}</p>
                <ul className="space-y-3">
                  {steps[activeStep - 1].details.map((detail, index) => (
                    <li key={index} className="flex items-center gap-3 text-gray-300">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-gradient-to-br from-bg-tertiary border-white/5 rounded-xl p-8 border border-white/10">
                <div className="text-center">
                  <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="text-accent-bright text-4xl">
                      {steps[activeStep - 1].icon}
                    </div>
                  </div>
                  <h4 className="text-xl font-semibold text-white mb-2">
                    {steps[activeStep - 1].title}
                  </h4>
                  <p className="text-gray-300">
                    Interactive demo coming soon
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <button
              onClick={() => setActiveStep(Math.max(1, activeStep - 1))}
              disabled={activeStep === 1}
              className="btn-secondary px-6 py-3 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous Step
            </button>
            
            <div className="flex space-x-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index + 1 === activeStep ? 'bg-accent-mid' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
            
            <button
              onClick={() => setActiveStep(Math.min(4, activeStep + 1))}
              disabled={activeStep === 4}
              className="btn-primary px-6 py-3 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
            >
              Next Step
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-20 px-6 bg-gradient-to-r from-bg-tertiary/50 to-bg-accent/50 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Why SpeakSafe?</h2>
            <p className="text-xl text-gray-300">The most secure and transparent whistleblowing platform</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                className="glass-card p-6 text-center hover:scale-105 transition-transform duration-300"
              >
                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="text-accent-bright">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-300 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="glass-card p-12"
          >
            <h2 className="text-3xl font-bold text-white mb-6">Ready to Make a Difference?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands who trust SpeakSafe to protect their identity while exposing corruption.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/report"
                className="btn-primary px-8 py-4 text-xl font-semibold rounded-xl hover:scale-105 transition-transform duration-300 inline-flex items-center gap-2"
              >
                <FileText className="w-5 h-5" />
                Submit Your Report
              </Link>
              <Link
                to="/faq"
                className="btn-secondary px-8 py-4 text-xl font-semibold rounded-xl hover:scale-105 transition-transform duration-300"
              >
                Have Questions?
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorksPage;
