import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Scale, Users, Globe, AlertCircle, CheckCircle, Mail } from 'lucide-react';
import Header from '../components/layout/Header';

const WhistleblowerRightsPage: React.FC = () => {
  const protectionsByRegion = [
    {
      region: "United States",
      laws: ["Whistleblower Protection Act", "Sarbanes-Oxley Act", "Dodd-Frank Act"],
      protections: ["Retaliation protection", "Financial rewards", "Anonymous reporting"]
    },
    {
      region: "European Union",
      laws: ["EU Whistleblower Protection Directive", "GDPR", "Various national laws"],
      protections: ["Legal protection", "Confidentiality", "Support measures"]
    },
    {
      region: "United Kingdom",
      laws: ["Public Interest Disclosure Act", "Employment Rights Act"],
      protections: ["Employment protection", "Compensation", "Legal remedies"]
    },
    {
      region: "Canada",
      laws: ["Public Servants Disclosure Protection Act", "Criminal Code"],
      protections: ["Job security", "Investigation rights", "Legal support"]
    },
    {
      region: "Japan",
      laws: ["Whistleblower Protection Act", "Corporate Governance Code", "Labor Standards Act"],
      protections: ["Employment protection", "Identity protection", "Investigation procedures"]
    },
    {
      region: "South Korea",
      laws: ["Protection of Public Interest Reporters Act", "Serious Crimes Investigation Office Act"],
      protections: ["Retaliation prohibition", "Reward system", "Legal support"]
    },
    {
      region: "Singapore",
      laws: ["Prevention of Corruption Act", "Companies Act", "Employment Act"],
      protections: ["Identity confidentiality", "Legal immunity", "Investigation protection"]
    },
    {
      region: "Australia",
      laws: ["Corporations Act", "Public Interest Disclosure Act", "Competition and Consumer Act"],
      protections: ["Compensation rights", "Identity protection", "Investigation support"]
    }
  ];

  return (
    <div className="min-h-screen bg-transparent">
      <Header />
      
      <div className="container mx-auto px-4 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-green-600/20 rounded-full mb-8"
            >
              <Shield className="w-10 h-10 text-green-400" />
            </motion.div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Whistleblower Rights
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Understanding your legal protections and rights when reporting wrongdoing
            </p>
          </div>

          {/* Your Rights Overview */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8 mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <Scale className="w-8 h-8 text-accent-bright" />
              Your Fundamental Rights
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-green-600/10 rounded-xl p-6 border border-green-500/20">
                <CheckCircle className="w-8 h-8 text-green-400 mb-4" />
                <h3 className="text-lg font-bold text-white mb-3">Protection from Retaliation</h3>
                <p className="text-gray-300 text-sm">
                  Legal protection against firing, demotion, harassment, or other forms of workplace retaliation.
                </p>
              </div>
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <Shield className="w-8 h-8 text-accent-bright mb-4" />
                <h3 className="text-lg font-bold text-white mb-3">Confidentiality</h3>
                <p className="text-gray-300 text-sm">
                  Right to have your identity protected and to report anonymously where legally permitted.
                </p>
              </div>
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <Users className="w-8 h-8 text-accent-bright mb-4" />
                <h3 className="text-lg font-bold text-white mb-3">Legal Support</h3>
                <p className="text-gray-300 text-sm">
                  Access to legal representation and support throughout the reporting and investigation process.
                </p>
              </div>
              <div className="bg-yellow-600/10 rounded-xl p-6 border border-yellow-500/20">
                <Scale className="w-8 h-8 text-yellow-400 mb-4" />
                <h3 className="text-lg font-bold text-white mb-3">Fair Investigation</h3>
                <p className="text-gray-300 text-sm">
                  Right to have your report investigated fairly and thoroughly by appropriate authorities.
                </p>
              </div>
              <div className="bg-red-600/10 rounded-xl p-6 border border-red-500/20">
                <AlertCircle className="w-8 h-8 text-red-400 mb-4" />
                <h3 className="text-lg font-bold text-white mb-3">Remedies</h3>
                <p className="text-gray-300 text-sm">
                  Right to compensation and remedies if you suffer retaliation for making a protected disclosure.
                </p>
              </div>
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <Globe className="w-8 h-8 text-accent-bright mb-4" />
                <h3 className="text-lg font-bold text-white mb-3">International Protection</h3>
                <p className="text-gray-300 text-sm">
                  Growing international recognition and protection for whistleblowers across jurisdictions.
                </p>
              </div>
            </div>
          </motion.section>

          {/* Regional Protections */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              Protections by Region
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {protectionsByRegion.map((region, index) => (
                <div
                  key={index}
                  className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6"
                >
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                    <Globe className="w-6 h-6 text-accent-bright" />
                    {region.region}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-200 mb-2">Key Laws:</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-300 text-sm">
                        {region.laws.map((law, lawIndex) => (
                          <li key={lawIndex}>{law}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-200 mb-2">Protections:</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-300 text-sm">
                        {region.protections.map((protection, protectionIndex) => (
                          <li key={protectionIndex}>{protection}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          {/* What Qualifies for Protection */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8 mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-6">
              What Qualifies for Protection?
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-green-400 mb-4">Protected Disclosures</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Violations of law, regulation, or legal obligation</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Miscarriages of justice</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Dangers to health and safety</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Environmental damage</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Fraud and financial misconduct</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Abuse of authority</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold text-red-400 mb-4">Requirements for Protection</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                    <span>Good faith belief in the wrongdoing</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                    <span>Disclosure in the public interest</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                    <span>Following proper reporting procedures</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                    <span>Reasonable belief in accuracy</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                    <span>Not acting for personal gain</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.section>

          {/* Steps to Take */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8 mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-6">
              Steps to Protect Yourself
            </h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-accent-mid rounded-full flex items-center justify-center text-white font-bold">1</div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Document Everything</h3>
                  <p className="text-gray-300">Keep detailed records of the wrongdoing, including dates, times, people involved, and any evidence.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-accent-mid rounded-full flex items-center justify-center text-white font-bold">2</div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Know Your Rights</h3>
                  <p className="text-gray-300">Research the whistleblower protection laws in your jurisdiction and understand what protections apply to you.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-accent-mid rounded-full flex items-center justify-center text-white font-bold">3</div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Seek Legal Advice</h3>
                  <p className="text-gray-300">Consult with a lawyer who specializes in whistleblower protection before making your disclosure.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-accent-mid rounded-full flex items-center justify-center text-white font-bold">4</div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Follow Proper Channels</h3>
                  <p className="text-gray-300">Use established reporting procedures when possible, or use secure platforms like SpeakSafe for anonymous reporting.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-accent-mid rounded-full flex items-center justify-center text-white font-bold">5</div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Protect Your Identity</h3>
                  <p className="text-gray-300">Use secure communication methods and consider anonymous reporting options to protect yourself from retaliation.</p>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Additional Resources */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.8 }}
            className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8 mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              Additional Resources by Region
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-3">
                  <Globe className="w-5 h-5 text-accent-bright" />
                  North America
                </h3>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>🇺🇸 Government Accountability Project (GAP)</li>
                  <li>🇺🇸 National Whistleblower Center</li>
                  <li>🇺🇸 SEC Office of the Whistleblower</li>
                  <li>🇨🇦 Public Sector Integrity Commissioner</li>
                  <li>🇨🇦 Canadian Bar Association</li>
                </ul>
              </div>

              <div className="bg-green-600/10 rounded-xl p-6 border border-green-500/20">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-3">
                  <Globe className="w-5 h-5 text-green-400" />
                  Europe
                </h3>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>🇪🇺 European Anti-Fraud Office (OLAF)</li>
                  <li>🇬🇧 Public Concern at Work</li>
                  <li>🇬🇧 Serious Fraud Office</li>
                  <li>🇩🇪 Transparency International Germany</li>
                  <li>🇫🇷 French Anti-Corruption Agency</li>
                </ul>
              </div>

              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-3">
                  <Globe className="w-5 h-5 text-accent-bright" />
                  Asia-Pacific
                </h3>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>🇯🇵 Japan Fair Trade Commission</li>
                  <li>🇰🇷 Anti-Corruption & Civil Rights Commission</li>
                  <li>🇸🇬 Corrupt Practices Investigation Bureau</li>
                  <li>🇦🇺 Australian Securities & Investments Commission</li>
                  <li>🇭🇰 Independent Commission Against Corruption</li>
                </ul>
              </div>

              <div className="bg-yellow-600/10 rounded-xl p-6 border border-yellow-500/20">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-3">
                  <Mail className="w-5 h-5 text-yellow-400" />
                  International Organizations
                </h3>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>🌐 Transparency International</li>
                  <li>🌐 International Association of Prosecutors</li>
                  <li>🌐 OECD Anti-Bribery Convention</li>
                  <li>🌐 UN Office on Drugs and Crime</li>
                  <li>🌐 World Bank Integrity Vice Presidency</li>
                </ul>
              </div>

              <div className="bg-red-600/10 rounded-xl p-6 border border-red-500/20">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-3">
                  <Scale className="w-5 h-5 text-red-400" />
                  Legal Support
                </h3>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>⚖️ Local Bar Association Referrals</li>
                  <li>⚖️ Legal Aid Societies</li>
                  <li>⚖️ Pro Bono Legal Services</li>
                  <li>⚖️ Employment Law Specialists</li>
                  <li>⚖️ Human Rights Organizations</li>
                </ul>
              </div>

              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-3">
                  <Shield className="w-5 h-5 text-accent-bright" />
                  Support Networks
                </h3>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>🤝 Whistleblower Support Groups</li>
                  <li>🤝 Professional Ethics Organizations</li>
                  <li>🤝 Journalist Protection Networks</li>
                  <li>🤝 Civil Society Organizations</li>
                  <li>🤝 Academic Research Centers</li>
                </ul>
              </div>
            </div>
          </motion.section>

          {/* Important Notice */}
          <div className="bg-yellow-600/10 rounded-xl p-6 border border-yellow-500/20 mt-12">
            <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-yellow-400" />
              Important Legal Notice
            </h3>
            <p className="text-gray-300 text-sm">
              This information is for educational purposes only and does not constitute legal advice. 
              Whistleblower protection laws vary significantly by jurisdiction and situation. 
              Always consult with a qualified attorney who specializes in whistleblower protection 
              before making any disclosures. SpeakSafe cannot provide legal advice or guarantee 
              protection under any specific law.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default WhistleblowerRightsPage;
