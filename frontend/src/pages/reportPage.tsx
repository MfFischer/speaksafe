import React from 'react';
import { motion } from 'framer-motion';
import { Shield, FileText, Lock, AlertTriangle } from 'lucide-react';
import { Layout } from '../components/layout';
import { Card } from '../components/ui';
import ReportForm from '../components/reportForm';

const ReportPage: React.FC = () => {
  return (
    <Layout>
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="p-3 bg-gradient-to-r from-accent-dark to-accent-mid rounded-xl">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                Submit Report
              </h1>
            </div>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto">
              Your voice matters. Report corruption, misconduct, and violations safely and anonymously
              using cutting-edge blockchain technology and zero-knowledge proofs.
            </p>
          </motion.div>

          {/* Security Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid md:grid-cols-3 gap-6 mb-12"
          >
            <Card className="text-center">
              <Shield className="w-12 h-12 text-accent-bright mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Anonymous Protection</h3>
              <p className="text-text-secondary text-sm">
                Zero-knowledge proofs ensure complete anonymity while maintaining report integrity
              </p>
            </Card>

            <Card className="text-center">
              <Lock className="w-12 h-12 text-accent-bright mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">End-to-End Encryption</h3>
              <p className="text-text-secondary text-sm">
                Military-grade encryption protects your data from unauthorized access
              </p>
            </Card>

            <Card className="text-center">
              <AlertTriangle className="w-12 h-12 text-accent-bright mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Immutable Storage</h3>
              <p className="text-text-secondary text-sm">
                Blockchain technology ensures reports cannot be tampered with or deleted
              </p>
            </Card>
          </motion.div>

          {/* Report Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <ReportForm />
          </motion.div>

          {/* Additional Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid md:grid-cols-2 gap-6 mt-12"
          >
            <Card>
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                <span className="mr-2">🌍</span>
                Regional Support
              </h3>
              <p className="text-text-secondary text-sm">
                SpeakSafe is designed for high-risk regions including Indonesia, Nepal, Bangladesh,
                and the Philippines where whistleblowers face severe retaliation. Our platform
                provides the highest level of protection for those who dare to speak truth to power.
              </p>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                <span className="mr-2">💰</span>
                Cost Information
              </h3>
              <p className="text-text-secondary text-sm">
                Submitting reports is completely free. Only blockchain operations require minimal
                gas fees (~$0.01 on Polygon) to ensure immutable storage. We believe financial
                barriers should never prevent someone from reporting wrongdoing.
              </p>
            </Card>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default ReportPage;
