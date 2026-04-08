import React, { useState } from 'react';
import complianceService, { ConsentData } from '../services/complianceService';
import '../assets/gradient.css';
import '../assets/animations.css';

interface CookieConsentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CookieConsentModal: React.FC<CookieConsentModalProps> = ({ isOpen, onClose }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [customConsent, setCustomConsent] = useState({
    essential: true, // Always true, can't be changed
    functional: true,
    analytics: false,
    marketing: false
  });

  if (!isOpen) return null;

  const handleAcceptAll = () => {
    const consent: ConsentData = {
      cookies: true,
      dataProcessing: true,
      analytics: true,
      timestamp: new Date().toISOString()
    };
    complianceService.setCookieConsent(consent);
    onClose();
  };

  const handleAcceptSelected = () => {
    const consent: ConsentData = {
      cookies: customConsent.functional,
      dataProcessing: true, // Always required
      analytics: customConsent.analytics,
      timestamp: new Date().toISOString()
    };
    complianceService.setCookieConsent(consent);
    onClose();
  };

  const handleRejectAll = () => {
    const consent: ConsentData = {
      cookies: false,
      dataProcessing: true, // Always required
      analytics: false,
      timestamp: new Date().toISOString()
    };
    complianceService.setCookieConsent(consent);
    onClose();
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <div className="frosted-glass max-w-4xl mx-auto p-6 rounded-t-lg animate-fade-in-up">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">🍪</div>
            <div>
              <h3 className="text-lg font-semibold text-white">Cookie Preferences</h3>
              <p className="text-text-primary text-sm">
                We use cookies to enhance your experience and protect your privacy.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-text-primary text-xl"
          >
            ×
          </button>
        </div>

        {!showDetails ? (
          <div className="space-y-4">
            <p className="text-text-primary text-sm">
              SpeakSafe uses essential cookies for security and functionality, plus optional cookies 
              to improve your experience. Your privacy and anonymity remain protected regardless of your choice.
            </p>
            
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleAcceptAll}
                className="btn-primary-gradient px-6 py-2 rounded-lg font-semibold text-sm"
              >
                Accept All
              </button>
              <button
                onClick={handleRejectAll}
                className="btn-secondary-gradient px-6 py-2 rounded-lg font-semibold text-sm"
              >
                Essential Only
              </button>
              <button
                onClick={() => setShowDetails(true)}
                className="text-text-primary hover:text-white px-6 py-2 text-sm font-semibold"
              >
                Customize
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 animate-fade-in">
            <div className="grid md:grid-cols-2 gap-4">
              {/* Essential Cookies */}
              <div className="frosted-glass p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-white">Essential Cookies</h4>
                  <div className="text-green-400 text-sm font-semibold">Always On</div>
                </div>
                <p className="text-text-primary text-sm mb-2">
                  Required for basic functionality, security, and anonymous reporting.
                </p>
                <ul className="text-text-primary text-xs space-y-1">
                  <li>• Session management</li>
                  <li>• Security tokens</li>
                  <li>• Form data protection</li>
                </ul>
              </div>

              {/* Functional Cookies */}
              <div className="frosted-glass p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-white">Functional Cookies</h4>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={customConsent.functional}
                      onChange={(e) => setCustomConsent(prev => ({ ...prev, functional: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-accent-mid"></div>
                  </label>
                </div>
                <p className="text-text-primary text-sm mb-2">
                  Remember your preferences and settings.
                </p>
                <ul className="text-text-primary text-xs space-y-1">
                  <li>• Language preferences</li>
                  <li>• UI customizations</li>
                  <li>• Privacy settings</li>
                </ul>
              </div>

              {/* Analytics Cookies */}
              <div className="frosted-glass p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-white">Analytics Cookies</h4>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={customConsent.analytics}
                      onChange={(e) => setCustomConsent(prev => ({ ...prev, analytics: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-accent-mid"></div>
                  </label>
                </div>
                <p className="text-text-primary text-sm mb-2">
                  Anonymous usage data to improve the platform.
                </p>
                <ul className="text-text-primary text-xs space-y-1">
                  <li>• Page views (anonymous)</li>
                  <li>• Feature usage</li>
                  <li>• Performance metrics</li>
                </ul>
              </div>

              {/* Marketing Cookies */}
              <div className="frosted-glass p-4 opacity-50">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-white">Marketing Cookies</h4>
                  <div className="text-gray-400 text-sm font-semibold">Not Used</div>
                </div>
                <p className="text-text-primary text-sm mb-2">
                  SpeakSafe does not use marketing or tracking cookies.
                </p>
                <ul className="text-text-primary text-xs space-y-1">
                  <li>• No advertising tracking</li>
                  <li>• No third-party marketing</li>
                  <li>• No behavioral profiling</li>
                </ul>
              </div>
            </div>

            <div className="border-t border-white/10 pt-4">
              <div className="flex flex-wrap gap-3 justify-center">
                <button
                  onClick={handleAcceptSelected}
                  className="btn-primary-gradient px-6 py-2 rounded-lg font-semibold text-sm"
                >
                  Save Preferences
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="btn-secondary-gradient px-6 py-2 rounded-lg font-semibold text-sm"
                >
                  Accept All
                </button>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-text-primary hover:text-white px-6 py-2 text-sm font-semibold"
                >
                  Back
                </button>
              </div>
            </div>

            <div className="text-center">
              <p className="text-text-primary text-xs">
                You can change these preferences anytime in Settings.
                <button className="text-text-primary hover:text-text-primary ml-1">Learn more about our privacy practices</button>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CookieConsentModal;
