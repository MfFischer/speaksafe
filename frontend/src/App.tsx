import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/homePage';
import ReportPage from './pages/reportPage';
import DaoPage from './pages/daoPage';
import SettingsPage from './pages/settingsPage';
import DonatePage from './pages/donatePage';
import FAQPage from './pages/faqPage';
import ContactPage from './pages/contactPage';
import HowItWorksPage from './pages/howItWorksPage';
import PrivacyPolicyPage from './pages/privacyPolicyPage';
import TermsOfServicePage from './pages/termsOfServicePage';
import CookiePolicyPage from './pages/cookiePolicyPage';
import SecurityPage from './pages/securityPage';
import LegalDisclaimerPage from './pages/legalDisclaimerPage';
import WhistleblowerRightsPage from './pages/whistleblowerRightsPage';
import AccessibilityPage from './pages/accessibilityPage';
import Footer from './components/Footer';
import CookieConsentModal from './components/cookieConsentModal';
import PrivacyConsentModal from './components/privacyConsentModal';
import LegalDisclaimer from './components/legalDisclaimer';
import complianceService, { ConsentData } from './services/complianceService';

function App() {
  const [showCookieConsent, setShowCookieConsent] = useState(false);
  const [showPrivacyConsent, setShowPrivacyConsent] = useState(false);
  const [showLegalDisclaimer, setShowLegalDisclaimer] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Check if user has given required consents
    const hasConsents = complianceService.hasRequiredConsents();

    if (!hasConsents) {
      // Show privacy consent modal first
      setShowPrivacyConsent(true);
    } else {
      setIsInitialized(true);
    }

    // Check if cookie consent banner should be shown
    const cookieConsent = complianceService.getCookieConsent();
    if (!cookieConsent) {
      setTimeout(() => setShowCookieConsent(true), 2000);
    }
  }, []);

  const handlePrivacyConsent = (consent: ConsentData) => {
    setShowPrivacyConsent(false);
    if (consent.dataProcessing) {
      setShowLegalDisclaimer(true);
    }
  };

  const handleLegalDisclaimerAccept = () => {
    setShowLegalDisclaimer(false);
    setIsInitialized(true);
  };

  if (!isInitialized) {
    return (
      <div className="min-h-screen gradient-background-animated flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-indigo-900/20"></div>
        <div className="glass-card p-12 text-center max-w-md mx-4 relative z-10 animate-fade-in-up">
          <div className="mb-8">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center animate-pulse hover-glow">
              <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              SpeakSafe
            </h1>
            <p className="text-lg text-gray-300 mb-6">Initializing secure platform...</p>
            <div className="loading-spinner mx-auto mb-4"></div>
            <div className="loading-dots mx-auto">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>

        <PrivacyConsentModal
          isOpen={showPrivacyConsent}
          onClose={() => setShowPrivacyConsent(false)}
          onConsent={handlePrivacyConsent}
        />

        <LegalDisclaimer
          isOpen={showLegalDisclaimer}
          onClose={() => setShowLegalDisclaimer(false)}
          onAccept={handleLegalDisclaimerAccept}
        />
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/report" element={<ReportPage />} />
          <Route path="/dao" element={<DaoPage />} />
          <Route path="/donate" element={<DonatePage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-of-service" element={<TermsOfServicePage />} />
          <Route path="/cookie-policy" element={<CookiePolicyPage />} />
          <Route path="/security" element={<SecurityPage />} />
          <Route path="/legal-disclaimer" element={<LegalDisclaimerPage />} />
          <Route path="/whistleblower-rights" element={<WhistleblowerRightsPage />} />
          <Route path="/accessibility" element={<AccessibilityPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>

        <Footer />

        <CookieConsentModal
          isOpen={showCookieConsent}
          onClose={() => setShowCookieConsent(false)}
        />
      </div>
    </Router>
  );
}

export default App;
