import React, { useState } from 'react';
import complianceService, { ConsentData } from '../services/complianceService';
import '../assets/gradient.css';
import '../assets/animations.css';

interface PrivacyConsentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConsent: (consent: ConsentData) => void;
}

const PrivacyConsentModal: React.FC<PrivacyConsentModalProps> = ({ 
  isOpen, 
  onClose, 
  onConsent 
}) => {
  const [consent, setConsent] = useState<ConsentData>({
    cookies: false,
    dataProcessing: false,
    analytics: false,
    timestamp: new Date().toISOString()
  });

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  if (!isOpen) return null;

  const handleConsentChange = (key: keyof ConsentData, value: boolean) => {
    setConsent(prev => ({ ...prev, [key]: value }));
  };

  const handleAcceptAll = () => {
    const fullConsent: ConsentData = {
      cookies: true,
      dataProcessing: true,
      analytics: true,
      timestamp: new Date().toISOString()
    };
    setConsent(fullConsent);
    complianceService.setCookieConsent(fullConsent);
    onConsent(fullConsent);
    onClose();
  };

  const handleCustomConsent = () => {
    if (!consent.dataProcessing) {
      alert('Data processing consent is required to use SpeakSafe.');
      return;
    }
    
    const finalConsent = { ...consent, timestamp: new Date().toISOString() };
    complianceService.setCookieConsent(finalConsent);
    onConsent(finalConsent);
    onClose();
  };

  const handleRejectAll = () => {
    const minimalConsent: ConsentData = {
      cookies: false,
      dataProcessing: true, // Required for basic functionality
      analytics: false,
      timestamp: new Date().toISOString()
    };
    setConsent(minimalConsent);
    complianceService.setCookieConsent(minimalConsent);
    onConsent(minimalConsent);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="frosted-glass max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8 modal-enter">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Privacy & Data Consent</h2>
          <div className="text-text-primary text-sm">
            Step {currentStep} of {totalSteps}
          </div>
        </div>

        {/* Step 1: Introduction */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold text-white mb-4">
                Your Privacy is Our Priority
              </h3>
              <p className="text-text-primary">
                SpeakSafe is designed to protect whistleblowers. We need your consent 
                to process data necessary for the platform to function while keeping 
                you anonymous and secure.
              </p>
            </div>

            <div className="frosted-glass p-4">
              <h4 className="font-semibold text-white mb-3">What Makes SpeakSafe Different:</h4>
              <ul className="text-text-primary text-sm space-y-2">
                <li className="flex items-start space-x-2">
                  <span className="text-green-400 mt-1">✓</span>
                  <span>Zero-knowledge proofs protect your identity</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-400 mt-1">✓</span>
                  <span>End-to-end encryption for all communications</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-400 mt-1">✓</span>
                  <span>Blockchain ensures immutable, tamper-proof records</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-400 mt-1">✓</span>
                  <span>No personal information required for reporting</span>
                </li>
              </ul>
            </div>

            <div className="flex justify-center">
              <button
                onClick={() => setCurrentStep(2)}
                className="btn-primary-gradient px-8 py-3 rounded-lg font-semibold"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Data Processing Details */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-xl font-semibold text-white mb-4">
              How We Process Your Data
            </h3>

            <div className="space-y-4">
              <div className="frosted-glass p-4">
                <h4 className="font-semibold text-white mb-2">Essential Data Processing (Required)</h4>
                <p className="text-text-primary text-sm mb-3">
                  Required for basic platform functionality and security.
                </p>
                <ul className="text-text-primary text-sm space-y-1">
                  <li>• Report content encryption and storage</li>
                  <li>• Blockchain hash generation and storage</li>
                  <li>• Zero-knowledge proof generation</li>
                  <li>• Basic security and fraud prevention</li>
                </ul>
                <div className="mt-3 flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="dataProcessing"
                    checked={consent.dataProcessing}
                    onChange={(e) => handleConsentChange('dataProcessing', e.target.checked)}
                    className="rounded"
                  />
                  <label htmlFor="dataProcessing" className="text-white text-sm">
                    I consent to essential data processing (Required)
                  </label>
                </div>
              </div>

              <div className="frosted-glass p-4">
                <h4 className="font-semibold text-white mb-2">Cookies and Local Storage (Optional)</h4>
                <p className="text-text-primary text-sm mb-3">
                  Used to remember your preferences and improve user experience.
                </p>
                <ul className="text-text-primary text-sm space-y-1">
                  <li>• User interface preferences</li>
                  <li>• Language and region settings</li>
                  <li>• Session management</li>
                  <li>• Privacy settings memory</li>
                </ul>
                <div className="mt-3 flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="cookies"
                    checked={consent.cookies}
                    onChange={(e) => handleConsentChange('cookies', e.target.checked)}
                    className="rounded"
                  />
                  <label htmlFor="cookies" className="text-white text-sm">
                    I consent to cookies and local storage
                  </label>
                </div>
              </div>

              <div className="frosted-glass p-4">
                <h4 className="font-semibold text-white mb-2">Analytics and Improvement (Optional)</h4>
                <p className="text-text-primary text-sm mb-3">
                  Anonymous usage data to help us improve the platform.
                </p>
                <ul className="text-text-primary text-sm space-y-1">
                  <li>• Anonymous usage statistics</li>
                  <li>• Performance monitoring</li>
                  <li>• Feature usage analytics</li>
                  <li>• Error reporting and debugging</li>
                </ul>
                <div className="mt-3 flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="analytics"
                    checked={consent.analytics}
                    onChange={(e) => handleConsentChange('analytics', e.target.checked)}
                    className="rounded"
                  />
                  <label htmlFor="analytics" className="text-white text-sm">
                    I consent to anonymous analytics
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setCurrentStep(1)}
                className="btn-secondary-gradient px-6 py-3 rounded-lg font-semibold"
              >
                Back
              </button>
              <button
                onClick={() => setCurrentStep(3)}
                className="btn-primary-gradient px-6 py-3 rounded-lg font-semibold"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Final Consent */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-xl font-semibold text-white mb-4">
              Confirm Your Choices
            </h3>

            <div className="frosted-glass p-4">
              <h4 className="font-semibold text-white mb-3">Your Consent Summary:</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-text-primary">Essential Data Processing:</span>
                  <span className={consent.dataProcessing ? 'text-green-400' : 'text-red-400'}>
                    {consent.dataProcessing ? 'Accepted' : 'Required'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-primary">Cookies & Local Storage:</span>
                  <span className={consent.cookies ? 'text-green-400' : 'text-gray-400'}>
                    {consent.cookies ? 'Accepted' : 'Declined'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-primary">Analytics:</span>
                  <span className={consent.analytics ? 'text-green-400' : 'text-gray-400'}>
                    {consent.analytics ? 'Accepted' : 'Declined'}
                  </span>
                </div>
              </div>
            </div>

            <div className="frosted-glass p-4 border border-white/10">
              <h4 className="font-semibold text-white mb-2">Your Rights:</h4>
              <ul className="text-text-primary text-sm space-y-1">
                <li>• You can change these preferences anytime in Settings</li>
                <li>• You can request data deletion at any time</li>
                <li>• You can export your data anytime</li>
                <li>• You can withdraw consent (may limit functionality)</li>
              </ul>
            </div>

            <div className="flex flex-col space-y-3">
              <button
                onClick={handleAcceptAll}
                className="btn-primary-gradient py-3 rounded-lg font-semibold"
              >
                Accept All & Continue
              </button>
              <button
                onClick={handleCustomConsent}
                className="btn-secondary-gradient py-3 rounded-lg font-semibold"
                disabled={!consent.dataProcessing}
              >
                Save My Choices
              </button>
              <button
                onClick={handleRejectAll}
                className="text-text-primary hover:text-white py-2 text-sm"
              >
                Use Essential Only
              </button>
            </div>

            <div className="text-center">
              <button
                onClick={() => setCurrentStep(2)}
                className="text-text-primary hover:text-text-primary text-sm"
              >
                ← Back to modify choices
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrivacyConsentModal;
