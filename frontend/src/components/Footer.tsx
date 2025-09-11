import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Twitter, Github, Mail, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900/95 backdrop-blur-sm border-t border-purple-500/30">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Shield className="w-8 h-8 text-purple-400" />
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                SpeakSafe
              </span>
            </Link>
            <p className="text-gray-400 mb-4 leading-relaxed">
              Empowering transparency through anonymous, blockchain-secured whistleblowing. 
              Your voice matters, your identity stays protected.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://twitter.com/speaksafe" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-purple-400 transition-colors"
                aria-label="Follow us on Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="https://github.com/speaksafe" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-purple-400 transition-colors"
                aria-label="View our GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a 
                href="mailto:hello@speaksafe.org" 
                className="text-gray-400 hover:text-purple-400 transition-colors"
                aria-label="Contact us via email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Platform</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/report" className="text-gray-400 hover:text-white transition-colors">
                  Submit Report
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-gray-400 hover:text-white transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/donate" className="text-gray-400 hover:text-white transition-colors">
                  Sponsor Reports
                </Link>
              </li>
              <li>
                <Link to="/dao" className="text-gray-400 hover:text-white transition-colors">
                  DAO Governance
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-400 hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal & Support</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/privacy-policy" className="text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-of-service" className="text-gray-400 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/cookie-policy" className="text-gray-400 hover:text-white transition-colors">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/security" className="text-gray-400 hover:text-white transition-colors">
                  Security & Privacy
                </Link>
              </li>
              <li>
                <Link to="/legal-disclaimer" className="text-gray-400 hover:text-white transition-colors">
                  Legal Disclaimer
                </Link>
              </li>
              <li>
                <Link to="/whistleblower-rights" className="text-gray-400 hover:text-white transition-colors">
                  Whistleblower Rights
                </Link>
              </li>

              <li>
                <Link to="/accessibility" className="text-gray-400 hover:text-white transition-colors">
                  Accessibility
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © {currentYear} SpeakSafe. All rights reserved. 
              <span className="mx-2">•</span>
              Built with <Heart className="w-4 h-4 inline text-red-400" /> for transparency.
            </div>
            
            <div className="flex items-center space-x-6 text-sm">
              <div className="text-gray-400">
                🔒 End-to-end encrypted
              </div>
              <div className="text-gray-400">
                ⛓️ Blockchain secured
              </div>
              <div className="text-gray-400">
                🌍 GDPR compliant
              </div>
            </div>
          </div>
          
          {/* GDPR Notice */}
          <div className="mt-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
            <p className="text-sm text-blue-200">
              <strong>Privacy Notice:</strong> We are committed to protecting your privacy and comply with GDPR regulations. 
              We collect minimal data, use strong encryption, and you have full control over your information. 
              <Link to="/privacy-policy" className="text-blue-300 hover:text-blue-200 underline ml-1">
                Learn more about our privacy practices
              </Link>.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
