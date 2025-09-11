import React from 'react';
import { motion } from 'framer-motion';
import { Cookie, Settings, Shield, BarChart3, Globe, AlertCircle } from 'lucide-react';
import Header from '../components/layout/Header';

const CookiePolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <Header />
      
      <div className="container mx-auto px-4 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-orange-600/20 rounded-full mb-6"
            >
              <Cookie className="w-8 h-8 text-orange-400" />
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Cookie Policy
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              How we use cookies and similar technologies on SpeakSafe
            </p>
            <div className="text-sm text-gray-400 mt-4">
              Last updated: January 15, 2024
            </div>
          </div>

          {/* Cookie Policy Content */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8 space-y-8">
            
            {/* What Are Cookies */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <Cookie className="w-6 h-6 text-orange-400" />
                What Are Cookies?
              </h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide information to website owners.
                </p>
                <p>
                  SpeakSafe uses cookies to enhance your experience, improve our services, and ensure the security of our anonymous reporting platform.
                </p>
              </div>
            </section>

            {/* Types of Cookies We Use */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <Settings className="w-6 h-6 text-blue-400" />
                Types of Cookies We Use
              </h2>
              <div className="space-y-6">
                
                {/* Essential Cookies */}
                <div className="bg-green-600/10 rounded-xl p-6 border border-green-500/20">
                  <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-green-400" />
                    Essential Cookies (Always Active)
                  </h3>
                  <p className="text-gray-300 mb-3">
                    These cookies are necessary for the website to function and cannot be switched off. They are usually only set in response to actions made by you.
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-gray-300 ml-4">
                    <li>Authentication and security</li>
                    <li>Form submission and validation</li>
                    <li>Privacy preferences</li>
                    <li>Load balancing</li>
                  </ul>
                </div>

                {/* Analytics Cookies */}
                <div className="bg-blue-600/10 rounded-xl p-6 border border-blue-500/20">
                  <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-blue-400" />
                    Analytics Cookies (Optional)
                  </h3>
                  <p className="text-gray-300 mb-3">
                    These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-gray-300 ml-4">
                    <li>Page views and user journeys</li>
                    <li>Performance monitoring</li>
                    <li>Error tracking</li>
                    <li>Usage statistics (fully anonymized)</li>
                  </ul>
                </div>

                {/* Functional Cookies */}
                <div className="bg-purple-600/10 rounded-xl p-6 border border-purple-500/20">
                  <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-purple-400" />
                    Functional Cookies (Optional)
                  </h3>
                  <p className="text-gray-300 mb-3">
                    These cookies enable enhanced functionality and personalization, such as remembering your preferences.
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-gray-300 ml-4">
                    <li>Language preferences</li>
                    <li>Theme settings (dark/light mode)</li>
                    <li>Accessibility preferences</li>
                    <li>Regional settings</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Privacy-First Approach */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <Shield className="w-6 h-6 text-green-400" />
                Our Privacy-First Approach
              </h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  As an anonymous whistleblowing platform, we take privacy extremely seriously:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>No Tracking Cookies:</strong> We do not use cookies for advertising or cross-site tracking</li>
                  <li><strong>Minimal Data Collection:</strong> We only collect what's necessary for functionality</li>
                  <li><strong>Anonymous Analytics:</strong> All analytics data is fully anonymized</li>
                  <li><strong>No Third-Party Sharing:</strong> Cookie data is never shared with third parties</li>
                  <li><strong>Regular Deletion:</strong> Non-essential cookies are automatically deleted</li>
                </ul>
              </div>
            </section>

            {/* Managing Your Cookie Preferences */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <Settings className="w-6 h-6 text-blue-400" />
                Managing Your Cookie Preferences
              </h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  You have full control over your cookie preferences:
                </p>
                
                <div className="bg-blue-600/10 rounded-xl p-6 border border-blue-500/20">
                  <h3 className="text-lg font-bold text-white mb-3">On SpeakSafe:</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                    <li>Use our Cookie Consent banner to manage preferences</li>
                    <li>Visit Settings → Privacy to update your choices anytime</li>
                    <li>Essential cookies cannot be disabled for security reasons</li>
                  </ul>
                </div>

                <div className="bg-purple-600/10 rounded-xl p-6 border border-purple-500/20">
                  <h3 className="text-lg font-bold text-white mb-3">In Your Browser:</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                    <li>Most browsers allow you to control cookies through settings</li>
                    <li>You can block or delete cookies, but this may affect functionality</li>
                    <li>Private/Incognito mode prevents most cookies from being stored</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* GDPR Compliance */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <AlertCircle className="w-6 h-6 text-yellow-400" />
                GDPR & Legal Compliance
              </h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  Under GDPR and other privacy laws, you have the right to:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Know what cookies we use and why</li>
                  <li>Give or withdraw consent for non-essential cookies</li>
                  <li>Access and delete your cookie data</li>
                  <li>Object to processing based on legitimate interests</li>
                </ul>
                <p>
                  We obtain your consent before setting non-essential cookies and provide clear information about our cookie usage.
                </p>
              </div>
            </section>

            {/* Updates to This Policy */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Updates to This Policy</h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons.
                </p>
                <p>
                  We will notify you of any material changes by posting the new policy on this page and updating the "Last updated" date.
                </p>
              </div>
            </section>

            {/* Contact Information */}
            <div className="bg-orange-600/10 rounded-xl p-6 border border-orange-500/20">
              <h3 className="text-xl font-bold text-white mb-3">Questions About Cookies?</h3>
              <p className="text-gray-300 mb-4">
                If you have any questions about our use of cookies, please contact us:
              </p>
              <div className="space-y-2 text-gray-300">
                <p>📧 Email: privacy@speaksafe.org</p>
                <p>🛡️ Data Protection Officer: dpo@speaksafe.org</p>
                <p>📍 Address: [Privacy Department Address]</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CookiePolicyPage;
