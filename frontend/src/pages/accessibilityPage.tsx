import React from 'react';
import { motion } from 'framer-motion';
import { Accessibility, Eye, Ear, Brain, Heart, Settings, CheckCircle, AlertCircle } from 'lucide-react';
import Header from '../components/layout/Header';

const AccessibilityPage: React.FC = () => {
  const currentFeatures = [
    {
      icon: <Eye className="w-8 h-8 text-green-400" />,
      title: "Currently Implemented",
      features: [
        "Semantic HTML structure",
        "Basic keyboard navigation support",
        "Screen reader compatible icons (Lucide React)",
        "Focus indicators on interactive elements",
        "Responsive design for all screen sizes",
        "No auto-playing audio or video"
      ]
    },
    {
      icon: <Settings className="w-8 h-8 text-accent-bright" />,
      title: "Partially Implemented",
      features: [
        "Form labels and error messages",
        "Color contrast (needs improvement)",
        "Text scaling (browser default)",
        "Consistent navigation layout",
        "Clear, simple language"
      ]
    }
  ];

  const plannedFeatures = [
    {
      icon: <Eye className="w-8 h-8 text-yellow-400" />,
      title: "Visual Accessibility (Planned)",
      features: [
        "High contrast color schemes",
        "Enhanced text scaling up to 200%",
        "Alternative text for all images",
        "Dark/light theme toggle",
        "Reduced motion settings"
      ]
    },
    {
      icon: <Ear className="w-8 h-8 text-accent-bright" />,
      title: "Auditory & Motor (Planned)",
      features: [
        "Enhanced keyboard navigation shortcuts",
        "Voice input support",
        "Larger clickable areas",
        "Skip navigation links",
        "Extended timeout options"
      ]
    },
    {
      icon: <Brain className="w-8 h-8 text-red-400" />,
      title: "Advanced Features (Planned)",
      features: [
        "ARIA labels and descriptions",
        "Screen reader announcements",
        "Context-sensitive help",
        "Simplified interface mode",
        "Multi-language support"
      ]
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
              <Accessibility className="w-10 h-10 text-accent-bright" />
            </motion.div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Accessibility
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              SpeakSafe is working toward full accessibility compliance. Here's our current status and roadmap.
            </p>
          </div>

          {/* Our Commitment */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8 mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <Heart className="w-8 h-8 text-red-400" />
              Our Commitment
            </h2>
            <div className="text-gray-300 space-y-4">
              <p className="text-lg">
                We believe that everyone has the right to report wrongdoing safely and anonymously, regardless of their abilities or the technology they use.
                SpeakSafe is actively working toward full accessibility compliance.
              </p>
              <p>
                <strong className="text-yellow-400">Current Status:</strong> We have implemented basic accessibility features and are working toward
                full WCAG 2.1 Level AA compliance. This page honestly reflects what's currently available versus what's planned for future releases.
              </p>
            </div>
          </motion.section>

          {/* Current Features */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              Current Accessibility Status
            </h2>
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {currentFeatures.map((category, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.6 }}
                  className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6"
                >
                  <div className="flex items-center gap-4 mb-6">
                    {category.icon}
                    <h3 className="text-xl font-bold text-white">{category.title}</h3>
                  </div>
                  <ul className="space-y-3">
                    {category.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3 text-gray-300">
                        <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>

            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              Planned Accessibility Features
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {plannedFeatures.map((category, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.6 }}
                  className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6"
                >
                  <div className="flex items-center gap-4 mb-6">
                    {category.icon}
                    <h3 className="text-lg font-bold text-white">{category.title}</h3>
                  </div>
                  <ul className="space-y-2">
                    {category.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3 text-gray-300 text-sm">
                        <AlertCircle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* WCAG Compliance Progress */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8 mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-6">
              WCAG 2.1 Level AA Compliance Progress
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-green-400 mb-4">✅ Currently Met</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Basic semantic HTML markup</li>
                  <li>• No seizure-inducing content</li>
                  <li>• Clear, simple language</li>
                  <li>• Consistent navigation layout</li>
                  <li>• Cross-browser compatibility</li>
                  <li>• No auto-playing audio/video</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold text-yellow-400 mb-4">🔄 In Progress</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Improving color contrast ratios</li>
                  <li>• Enhanced keyboard navigation</li>
                  <li>• Form error identification</li>
                  <li>• Focus indicators enhancement</li>
                  <li>• Basic assistive technology support</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold text-red-400 mb-4">📋 Planned</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Alternative text for all images</li>
                  <li>• ARIA labels and descriptions</li>
                  <li>• Skip navigation links</li>
                  <li>• Enhanced text scaling (200%)</li>
                  <li>• Context-sensitive help</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold text-accent-bright mb-4">🎯 Target Timeline</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Q1 2024: Basic compliance</li>
                  <li>• Q2 2024: Enhanced features</li>
                  <li>• Q3 2024: Full WCAG AA compliance</li>
                  <li>• Q4 2024: Advanced accessibility</li>
                  <li>• Ongoing: User feedback integration</li>
                </ul>
              </div>
            </div>
          </motion.section>

          {/* Assistive Technology Support */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8 mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <Settings className="w-8 h-8 text-accent-bright" />
              Assistive Technology Support Status
            </h2>
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-green-600/10 rounded-xl p-6 border border-green-500/20">
                <h3 className="text-lg font-bold text-white mb-3">✅ Currently Supported</h3>
                <ul className="text-gray-300 text-sm space-y-2">
                  <li>• Basic screen reader compatibility (semantic HTML)</li>
                  <li>• Browser zoom functionality (up to 500%)</li>
                  <li>• Keyboard navigation (Tab, Enter, Escape)</li>
                  <li>• Standard browser accessibility features</li>
                </ul>
              </div>
              <div className="bg-yellow-600/10 rounded-xl p-6 border border-yellow-500/20">
                <h3 className="text-lg font-bold text-white mb-3">🔄 Being Tested</h3>
                <ul className="text-gray-300 text-sm space-y-2">
                  <li>• NVDA screen reader compatibility</li>
                  <li>• VoiceOver (macOS/iOS) support</li>
                  <li>• High contrast mode detection</li>
                  <li>• Reduced motion preferences</li>
                </ul>
              </div>
            </div>
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="text-lg font-bold text-white mb-3">📋 Planned Support</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-medium text-white mb-2">Screen Readers</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• JAWS</li>
                    <li>• TalkBack</li>
                    <li>• Orca</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-white mb-2">Voice Control</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Dragon NaturallySpeaking</li>
                    <li>• Windows Speech Recognition</li>
                    <li>• Voice Access (Android)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-white mb-2">Other Tools</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Switch navigation devices</li>
                    <li>• Eye-tracking systems</li>
                    <li>• Magnification software</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Accessibility Settings */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.8 }}
            className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8 mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-6">
              Customization Options Status
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-green-400 mb-4">✅ Available Now</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Browser-based font size adjustment</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Responsive design for all screen sizes</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Basic keyboard navigation</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold text-yellow-400 mb-4">🔄 Coming Soon</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                    <span>High contrast mode toggle</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                    <span>Dark/light theme options</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                    <span>Reduced motion settings</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                    <span>Enhanced keyboard shortcuts</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                    <span>Simplified interface mode</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.section>

          {/* Feedback and Support */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.8 }}
            className="grid md:grid-cols-2 gap-8"
          >
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-4">
                Accessibility Feedback
              </h3>
              <p className="text-gray-300 mb-4">
                We continuously work to improve our accessibility. If you encounter any barriers or have suggestions:
              </p>
              <div className="space-y-2 text-gray-300 text-sm">
                <p>📧 Email: Use our contact form</p>
                <p>📝 Feedback Form: Available on our Contact page</p>
                <p>🐛 GitHub Issues: Report accessibility bugs</p>
                <p>💬 Community: Join our accessibility discussions</p>
              </div>
            </div>

            <div className="bg-green-600/10 rounded-xl p-6 border border-green-500/20">
              <h3 className="text-xl font-bold text-white mb-4">
                Accessibility Support
              </h3>
              <p className="text-gray-300 mb-4">
                Need help using our platform? Our accessibility support team is here to assist:
              </p>
              <div className="space-y-2 text-gray-300 text-sm">
                <p>🕒 Response Time: Within 48 hours</p>
                <p>🌍 Languages: Currently English (more coming)</p>
                <p>📱 Platform: Web-based support</p>
                <p>🤝 Community: User-driven accessibility improvements</p>
              </div>
            </div>
          </motion.section>

          {/* Ongoing Commitment */}
          <div className="bg-white/5 rounded-xl p-6 border border-white/10 mt-12">
            <h3 className="text-xl font-bold text-white mb-3">
              Our Ongoing Commitment
            </h3>
            <p className="text-gray-300">
              Accessibility is not a one-time effort but an ongoing commitment. We are actively working to improve
              our platform's accessibility with each release. This page will be updated regularly to reflect our
              current progress. We welcome feedback from users with disabilities to help us prioritize improvements
              and ensure SpeakSafe becomes truly accessible to everyone who needs to report wrongdoing safely and anonymously.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AccessibilityPage;
