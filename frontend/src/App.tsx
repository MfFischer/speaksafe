import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/homePage';
import ReportPage from './pages/reportPage';
import DaoPage from './pages/daoPage';
import WhitepaperPage from './pages/whitepaperPage';
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
import Chatbot from './components/Chatbot';
import complianceService, { ConsentData } from './services/complianceService';
import { Web3Provider } from './context/Web3Context';

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
      <div className="min-h-screen bg-mesh-gradient flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-bg-tertiary to-bg-secondary"></div>
        <div className="glass-card p-12 text-center max-w-md mx-4 relative z-10 animate-fade-in-up">
          <div className="mb-8 scale-in">
            <div className="w-24 h-24 mx-auto mb-8 rounded-2xl overflow-hidden shadow-2xl border border-white/10 animate-float">
              <img src="/logo-premium.png" alt="SpeakSafe Logo" className="w-full h-full object-cover" />
            </div>
            <h1 className="text-4xl font-bold mb-3 tracking-tighter bg-gradient-to-r from-white via-accent-mid to-accent-bright bg-clip-text text-transparent">
              SpeakSafe
            </h1>
            <p className="text-sm font-semibold text-accent-mid uppercase tracking-[0.2em] mb-4">
              The SpeakSafe Network
            </p>
            <p className="text-gray-400 text-sm italic mb-8 max-w-[250px] mx-auto leading-relaxed">
              A decentralized infrastructure for the truth.
            </p>
            <div className="flex flex-col items-center">
              <div className="loading-spinner mb-4 grayscale opacity-50"></div>
              <p className="text-xs text-text-muted animate-pulse">Initializing encryption protocols...</p>
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
    <Web3Provider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/report" element={<ReportPage />} />
            <Route path="/dao" element={<DaoPage />} />
            <Route path="/donate" element={<DonatePage />} />
            <Route path="/whitepaper" element={<WhitepaperPage />} />
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

          <Chatbot />
        </div>
      </Router>
    </Web3Provider>
  );
}

export default App;
