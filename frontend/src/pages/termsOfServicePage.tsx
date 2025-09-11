import React from 'react';
import { motion } from 'framer-motion';
import { Shield, FileText, AlertTriangle, Scale, Users, Globe } from 'lucide-react';
import Header from '../components/layout/Header';

const TermsOfServicePage: React.FC = () => {
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
              className="inline-flex items-center justify-center w-16 h-16 bg-purple-600/20 rounded-full mb-6"
            >
              <Scale className="w-8 h-8 text-purple-400" />
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Terms of Service
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Legal terms and conditions for using the SpeakSafe platform
            </p>
            <div className="text-sm text-gray-400 mt-4">
              Last updated: January 15, 2024
            </div>
          </div>

          {/* Terms Content */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8 space-y-8">
            
            {/* 1. Acceptance of Terms */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <FileText className="w-6 h-6 text-purple-400" />
                1. Acceptance of Terms
              </h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  By accessing and using SpeakSafe ("the Platform"), you accept and agree to be bound by the terms and provision of this agreement.
                </p>
                <p>
                  If you do not agree to abide by the above, please do not use this service.
                </p>
              </div>
            </section>

            {/* 2. Use License */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <Shield className="w-6 h-6 text-blue-400" />
                2. Use License
              </h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  Permission is granted to temporarily use SpeakSafe for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>modify or copy the materials</li>
                  <li>use the materials for any commercial purpose or for any public display</li>
                  <li>attempt to reverse engineer any software contained on the platform</li>
                  <li>remove any copyright or other proprietary notations from the materials</li>
                </ul>
              </div>
            </section>

            {/* 3. Anonymous Reporting */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <Users className="w-6 h-6 text-green-400" />
                3. Anonymous Reporting
              </h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  SpeakSafe provides anonymous reporting capabilities using blockchain technology and zero-knowledge proofs. By using this service:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>You acknowledge that reports are immutable once submitted to the blockchain</li>
                  <li>You agree to provide truthful and accurate information</li>
                  <li>You understand that false reports may have legal consequences</li>
                  <li>You accept that we cannot delete or modify reports once submitted</li>
                </ul>
              </div>
            </section>

            {/* 4. Prohibited Uses */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-red-400" />
                4. Prohibited Uses
              </h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  You may not use SpeakSafe for any unlawful purpose or to solicit others to perform unlawful acts. You may not:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Submit false, misleading, or defamatory reports</li>
                  <li>Violate any local, state, national, or international law</li>
                  <li>Infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
                  <li>Harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                  <li>Submit spam or unsolicited content</li>
                </ul>
              </div>
            </section>

            {/* 5. Disclaimer */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <Globe className="w-6 h-6 text-yellow-400" />
                5. Disclaimer
              </h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  The information on this platform is provided on an 'as is' basis. To the fullest extent permitted by law, SpeakSafe excludes all representations, warranties, conditions and terms.
                </p>
                <p>
                  SpeakSafe does not guarantee the accuracy, completeness, or usefulness of any information and shall not be responsible for any errors, omissions, or results obtained from the use of such information.
                </p>
              </div>
            </section>

            {/* 6. Limitations */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">6. Limitations</h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  In no event shall SpeakSafe or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on SpeakSafe, even if SpeakSafe or an authorized representative has been notified orally or in writing of the possibility of such damage.
                </p>
              </div>
            </section>

            {/* 7. Governing Law */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">7. Governing Law</h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction in which SpeakSafe operates, and you irrevocably submit to the exclusive jurisdiction of the courts in that state or location.
                </p>
              </div>
            </section>

            {/* Contact Information */}
            <div className="bg-purple-600/10 rounded-xl p-6 border border-purple-500/20">
              <h3 className="text-xl font-bold text-white mb-3">Questions About These Terms?</h3>
              <p className="text-gray-300 mb-4">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="space-y-2 text-gray-300">
                <p>📧 Email: legal@speaksafe.org</p>
                <p>📍 Address: [Legal Department Address]</p>
                <p>📞 Phone: [Legal Department Phone]</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsOfServicePage;
