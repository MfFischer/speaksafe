import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import complianceService, { PrivacySettings, ConsentData } from '../services/complianceService';

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'privacy' | 'security' | 'account'>('privacy');
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
    dataRetention: 365,
    anonymousReporting: true,
    encryptionLevel: 'high'
  });
  const [consentData, setConsentData] = useState<ConsentData | null>(null);
  // const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // setIsLoaded(true);
    // Load current settings
    const currentSettings = complianceService.getPrivacySettings();
    const currentConsent = complianceService.getCookieConsent();
    setPrivacySettings(currentSettings);
    setConsentData(currentConsent);
  }, []);

  const handlePrivacySettingsChange = (key: keyof PrivacySettings, value: any) => {
    const newSettings = { ...privacySettings, [key]: value };
    setPrivacySettings(newSettings);
    complianceService.setPrivacySettings(newSettings);
  };

  const handleConsentChange = (key: keyof ConsentData, value: boolean) => {
    if (!consentData) return;
    const newConsent = { ...consentData, [key]: value };
    setConsentData(newConsent);
    complianceService.setCookieConsent(newConsent);
  };

  const handleDataDeletion = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete all your data? This action cannot be undone.'
    );
    if (confirmed) {
      const success = await complianceService.requestDataDeletion('user-identifier');
      if (success) {
        alert('Data deletion request submitted successfully.');
        complianceService.clearAllLocalData();
      } else {
        alert('Failed to submit data deletion request. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-transparent">
      {/* Header */}
      <header className="bg-gray-900/90 backdrop-blur-sm py-4 px-6 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="text-white text-2xl font-bold">
            SpeakSafe
          </Link>
          <nav className="space-x-6">
            <Link to="/" className="text-white hover:text-text-primary transition-colors font-medium">Home</Link>
            <Link to="/report" className="text-white hover:text-text-primary transition-colors font-medium">Report</Link>
            <Link to="/dao" className="text-white hover:text-text-primary transition-colors font-medium">DAO</Link>
            <Link to="/donate" className="text-white hover:text-text-primary transition-colors font-medium">Donate</Link>
            <Link to="/settings" className="text-white hover:text-text-primary transition-colors font-semibold">Settings</Link>
          </nav>
        </div>
      </header>

      <div className="pt-8 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Settings
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Manage your privacy, security, and account preferences
            </p>
          </motion.div>

          {/* Tab Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center mb-8"
          >
            <div className="frosted-glass p-2 rounded-lg">
              <div className="flex space-x-2">
                {['privacy', 'security', 'account'].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab as any)}
                    className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                      activeTab === tab
                        ? 'bg-gradient-to-r from-accent-dark to-accent-mid text-white'
                        : 'text-gray-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Privacy Tab */}
          {activeTab === 'privacy' && (
            <div className="space-y-6 animate-fade-in">
              <div className="frosted-glass p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Data Retention</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-text-primary mb-2">
                      How long should we keep your data? (days)
                    </label>
                    <select
                      value={privacySettings.dataRetention}
                      onChange={(e) => handlePrivacySettingsChange('dataRetention', parseInt(e.target.value))}
                      className="w-full p-3 rounded-lg bg-bg-tertiary/50 border border-white/10 text-white"
                    >
                      <option value={30}>30 days</option>
                      <option value={90}>90 days</option>
                      <option value={365}>1 year</option>
                      <option value={1095}>3 years</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="frosted-glass p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Reporting Preferences</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-white font-medium">Anonymous Reporting</div>
                      <div className="text-text-primary text-sm">Always submit reports anonymously</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={privacySettings.anonymousReporting}
                        onChange={(e) => handlePrivacySettingsChange('anonymousReporting', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-mid"></div>
                    </label>
                  </div>

                  <div>
                    <label className="block text-text-primary mb-2">Encryption Level</label>
                    <select
                      value={privacySettings.encryptionLevel}
                      onChange={(e) => handlePrivacySettingsChange('encryptionLevel', e.target.value)}
                      className="w-full p-3 rounded-lg bg-bg-tertiary/50 border border-white/10 text-white"
                    >
                      <option value="standard">Standard</option>
                      <option value="high">High (Recommended)</option>
                    </select>
                  </div>
                </div>
              </div>

              {consentData && (
                <div className="frosted-glass p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Cookie Preferences</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white font-medium">Essential Cookies</div>
                        <div className="text-text-primary text-sm">Required for basic functionality</div>
                      </div>
                      <div className="text-green-400 font-semibold">Always On</div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white font-medium">Analytics Cookies</div>
                        <div className="text-text-primary text-sm">Help us improve the platform</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={consentData.analytics}
                          onChange={(e) => handleConsentChange('analytics', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-mid"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6 animate-fade-in">
              <div className="frosted-glass p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Wallet Connection</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div>
                      <div className="text-white font-medium">MetaMask</div>
                      <div className="text-text-primary text-sm">Connected: 0x1234...5678</div>
                    </div>
                    <button type="button" className="btn-secondary px-4 py-2 rounded-lg text-sm font-semibold">
                      Disconnect
                    </button>
                  </div>
                </div>
              </div>

              <div className="frosted-glass p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Two-Factor Authentication</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-white font-medium">2FA Status</div>
                      <div className="text-text-primary text-sm">Secure your account with 2FA</div>
                    </div>
                    <button type="button" className="btn-primary px-4 py-2 rounded-lg text-sm font-semibold">
                      Enable 2FA
                    </button>
                  </div>
                </div>
              </div>

              <div className="frosted-glass p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Session Management</h3>
                <div className="space-y-4">
                  <div className="text-text-primary text-sm mb-4">
                    Active sessions will be automatically logged out after 24 hours of inactivity.
                  </div>
                  <button type="button" className="btn-secondary px-4 py-2 rounded-lg text-sm font-semibold">
                    Log Out All Sessions
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Account Tab */}
          {activeTab === 'account' && (
            <div className="space-y-6 animate-fade-in">
              <div className="frosted-glass p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Account Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-text-primary mb-2">Display Name (Optional)</label>
                    <input
                      type="text"
                      placeholder="Anonymous User"
                      className="w-full p-3 rounded-lg bg-bg-tertiary/50 border border-white/10 text-white placeholder-blue-300"
                    />
                  </div>
                  <div>
                    <label className="block text-text-primary mb-2">Preferred Language</label>
                    <select className="w-full p-3 rounded-lg bg-bg-tertiary/50 border border-white/10 text-white">
                      <option value="en">English</option>
                      <option value="id">Bahasa Indonesia</option>
                      <option value="tl">Tagalog</option>
                      <option value="ne">Nepali</option>
                      <option value="bn">Bengali</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="frosted-glass p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Data Management</h3>
                <div className="space-y-4">
                  <button type="button" className="btn-secondary px-4 py-2 rounded-lg text-sm font-semibold w-full">
                    Export My Data
                  </button>
                  <button type="button" className="btn-secondary px-4 py-2 rounded-lg text-sm font-semibold w-full">
                    Download Report History
                  </button>
                </div>
              </div>

              <div className="frosted-glass p-6 border border-red-400/30">
                <h3 className="text-xl font-semibold text-red-400 mb-4">Danger Zone</h3>
                <div className="space-y-4">
                  <div className="text-text-primary text-sm mb-4">
                    Once you delete your account, there is no going back. Please be certain.
                  </div>
                  <button
                    type="button"
                    onClick={handleDataDeletion}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                  >
                    Delete All My Data
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
