import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Scale, FileText, Shield, Globe, Info } from 'lucide-react';
import Header from '../components/layout/Header';

const LegalDisclaimerPage: React.FC = () => {
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
              className="inline-flex items-center justify-center w-16 h-16 bg-yellow-600/20 rounded-full mb-6"
            >
              <AlertTriangle className="w-8 h-8 text-yellow-400" />
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Legal Disclaimer
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Important legal information about using the SpeakSafe platform
            </p>
            <div className="text-sm text-gray-400 mt-4">
              Last updated: January 15, 2024
            </div>
          </div>

          {/* Disclaimer Content */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8 space-y-8">
            
            {/* General Disclaimer */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <Info className="w-6 h-6 text-blue-400" />
                General Disclaimer
              </h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  The information contained on SpeakSafe is for general information purposes only. While we endeavor to keep the information up to date and correct, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability of the platform or the information, products, services, or related graphics contained on the platform for any purpose.
                </p>
                <p>
                  Any reliance you place on such information is therefore strictly at your own risk.
                </p>
              </div>
            </section>

            {/* Platform Limitations */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <Shield className="w-6 h-6 text-purple-400" />
                Platform Limitations
              </h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  SpeakSafe provides a platform for anonymous reporting using blockchain technology. However, users should be aware of the following limitations:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>We cannot guarantee the outcome of any report submitted through our platform</li>
                  <li>We do not investigate or verify the accuracy of submitted reports</li>
                  <li>We cannot provide legal advice or representation</li>
                  <li>We cannot guarantee complete anonymity in all jurisdictions</li>
                  <li>Blockchain transactions may be subject to network delays or failures</li>
                </ul>
              </div>
            </section>

            {/* Legal Advice Disclaimer */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <Scale className="w-6 h-6 text-green-400" />
                Legal Advice Disclaimer
              </h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  <strong>SpeakSafe does not provide legal advice.</strong> The information on this platform is not intended as legal advice and should not be construed as such. Users should consult with qualified legal professionals regarding their specific situations.
                </p>
                <div className="bg-yellow-600/10 rounded-xl p-6 border border-yellow-500/20">
                  <h3 className="text-lg font-bold text-white mb-3">Important Legal Considerations:</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                    <li>Whistleblower protection laws vary by jurisdiction</li>
                    <li>Some reports may be subject to legal disclosure requirements</li>
                    <li>False reports may have legal consequences</li>
                    <li>Consider consulting a lawyer before making sensitive reports</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Accuracy of Information */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <FileText className="w-6 h-6 text-blue-400" />
                Accuracy of Information
              </h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  Users are solely responsible for the accuracy and truthfulness of information submitted through SpeakSafe. We strongly encourage users to:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Verify facts before submitting reports</li>
                  <li>Provide only truthful and accurate information</li>
                  <li>Include supporting evidence when possible</li>
                  <li>Avoid speculation or unsubstantiated claims</li>
                  <li>Understand that false reports may have serious consequences</li>
                </ul>
              </div>
            </section>

            {/* Jurisdictional Limitations */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <Globe className="w-6 h-6 text-purple-400" />
                Jurisdictional Limitations
              </h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  SpeakSafe operates in a global, decentralized environment. However, users should be aware that:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Local laws and regulations may apply to your use of the platform</li>
                  <li>Whistleblower protections vary significantly between countries</li>
                  <li>Some jurisdictions may prohibit anonymous reporting</li>
                  <li>Blockchain technology may not be legally recognized in all areas</li>
                  <li>Users are responsible for compliance with local laws</li>
                </ul>
              </div>
            </section>

            {/* Limitation of Liability */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Limitation of Liability</h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  In no event will SpeakSafe, its operators, or its contributors be liable for any damages including, without limitation, indirect or consequential damages, or any damages whatsoever arising from use or loss of use, data, or profits, whether in action of contract, negligence, or other tortious action, arising out of or in connection with the use of this platform.
                </p>
                <p>
                  This includes but is not limited to damages arising from:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Use or inability to use the platform</li>
                  <li>Unauthorized access to or alteration of your transmissions or data</li>
                  <li>Statements or conduct of any third party on the platform</li>
                  <li>Any other matter relating to the platform</li>
                </ul>
              </div>
            </section>

            {/* Indemnification */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Indemnification</h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  Users agree to indemnify and hold harmless SpeakSafe, its operators, contributors, and affiliates from any claim or demand, including reasonable attorneys' fees, made by any third party due to or arising out of:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Your use of the platform</li>
                  <li>Your violation of these terms</li>
                  <li>Your violation of any rights of another</li>
                  <li>Any content you submit through the platform</li>
                </ul>
              </div>
            </section>

            {/* Changes to Disclaimer */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Changes to This Disclaimer</h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  We reserve the right to modify this disclaimer at any time. Changes will be effective immediately upon posting to this page. Your continued use of the platform after any changes constitutes acceptance of the new disclaimer.
                </p>
              </div>
            </section>

            {/* Contact Information */}
            <div className="bg-yellow-600/10 rounded-xl p-6 border border-yellow-500/20">
              <h3 className="text-xl font-bold text-white mb-3">Legal Questions?</h3>
              <p className="text-gray-300 mb-4">
                If you have questions about this legal disclaimer or need legal guidance, please contact:
              </p>
              <div className="space-y-2 text-gray-300">
                <p>📧 Email: legal@speaksafe.org</p>
                <p>⚖️ Legal Department: [Legal Department Address]</p>
                <p>📞 Phone: [Legal Department Phone]</p>
                <p className="text-sm text-yellow-400 mt-4">
                  Note: This contact is for platform-related legal questions only, not for legal advice about your specific situation.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LegalDisclaimerPage;
