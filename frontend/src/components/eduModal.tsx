import React from 'react';
import '../assets/gradient.css';
import '../assets/animations.css';

interface EduModalProps {
  isOpen: boolean;
  onClose: () => void;
  region?: 'indonesia' | 'nepal' | 'bangladesh' | 'philippines' | 'general';
}

const EduModal: React.FC<EduModalProps> = ({ isOpen, onClose, region = 'general' }) => {
  if (!isOpen) return null;

  const getRegionalContent = () => {
    switch (region) {
      case 'indonesia':
        return {
          title: 'Whistleblower Protection in Indonesia',
          laws: [
            'Law No. 13 of 2006 on Witness and Victim Protection',
            'Law No. 31 of 1999 on Corruption Eradication (amended by Law No. 20 of 2001)',
            'Government Regulation No. 43 of 2018 on Procedures for Implementing Witness and Victim Protection'
          ],
          risks: [
            'Retaliation from corrupt officials',
            'Job termination or demotion',
            'Legal intimidation',
            'Physical threats to safety'
          ],
          contacts: [
            'Corruption Eradication Commission (KPK): 198',
            'Witness and Victim Protection Agency (LPSK): +62-21-31993472',
            'Indonesian Ombudsman: 0804-1-696-696'
          ]
        };
      case 'philippines':
        return {
          title: 'Whistleblower Protection in Philippines',
          laws: [
            'Republic Act No. 6713 (Code of Conduct and Ethical Standards)',
            'Republic Act No. 3019 (Anti-Graft and Corrupt Practices Act)',
            'Whistleblower Protection Act (pending legislation)'
          ],
          risks: [
            'Political retaliation',
            'Employment discrimination',
            'Legal harassment',
            'Personal safety threats'
          ],
          contacts: [
            'Ombudsman Hotline: 8-USAPAN (8-872726)',
            'Sandiganbayan: +63-2-8421-1644',
            'Commission on Human Rights: +63-2-8521-8391'
          ]
        };
      default:
        return {
          title: 'General Whistleblower Rights and Protections',
          laws: [
            'UN Convention Against Corruption (UNCAC)',
            'International Labour Organization (ILO) conventions',
            'Regional human rights frameworks'
          ],
          risks: [
            'Employment retaliation',
            'Legal intimidation',
            'Social ostracism',
            'Personal safety concerns'
          ],
          contacts: [
            'Transparency International: +49-30-34-38-200',
            'UN Office on Drugs and Crime: +43-1-26060',
            'Local human rights organizations'
          ]
        };
    }
  };

  const content = getRegionalContent();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="frosted-glass max-w-4xl w-full max-h-[90vh] overflow-y-auto p-8 modal-enter">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">{content.title}</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-blue-200 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        <div className="space-y-6 text-blue-100">
          {/* Introduction */}
          <div className="frosted-glass p-4">
            <h3 className="font-semibold text-white mb-3">🛡️ Why Whistleblowing Matters</h3>
            <p className="text-sm">
              Whistleblowing is a crucial tool for exposing corruption, fraud, and misconduct. 
              It helps protect public interest and promotes transparency and accountability in 
              both public and private sectors.
            </p>
          </div>

          {/* Legal Framework */}
          <div className="frosted-glass p-4">
            <h3 className="font-semibold text-white mb-3">⚖️ Legal Protections</h3>
            <ul className="text-sm space-y-2">
              {content.laws.map((law, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="text-blue-300 mt-1">•</span>
                  <span>{law}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Risks and Challenges */}
          <div className="frosted-glass p-4">
            <h3 className="font-semibold text-white mb-3">⚠️ Common Risks</h3>
            <div className="grid md:grid-cols-2 gap-3">
              {content.risks.map((risk, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm">
                  <span className="text-red-400">⚠️</span>
                  <span>{risk}</span>
                </div>
              ))}
            </div>
          </div>

          {/* How SpeakSafe Helps */}
          <div className="frosted-glass p-4">
            <h3 className="font-semibold text-white mb-3">🔒 How SpeakSafe Protects You</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-white mb-2">Technical Protection</h4>
                <ul className="space-y-1">
                  <li>• Zero-knowledge proofs hide your identity</li>
                  <li>• End-to-end encryption protects data</li>
                  <li>• Blockchain ensures immutable records</li>
                  <li>• No personal information required</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-white mb-2">Process Protection</h4>
                <ul className="space-y-1">
                  <li>• Anonymous submission process</li>
                  <li>• DAO-based review system</li>
                  <li>• Secure escalation channels</li>
                  <li>• Community support network</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Best Practices */}
          <div className="frosted-glass p-4">
            <h3 className="font-semibold text-white mb-3">✅ Best Practices for Safe Reporting</h3>
            <div className="space-y-3 text-sm">
              <div>
                <h4 className="font-medium text-white">Before Reporting:</h4>
                <ul className="mt-1 space-y-1">
                  <li>• Document evidence carefully and securely</li>
                  <li>• Use secure communication channels</li>
                  <li>• Consider using public computers or VPN</li>
                  <li>• Don't discuss with colleagues initially</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-white">During Reporting:</h4>
                <ul className="mt-1 space-y-1">
                  <li>• Provide specific, factual information</li>
                  <li>• Include dates, locations, and people involved</li>
                  <li>• Attach supporting evidence if available</li>
                  <li>• Keep copies of all submissions</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Emergency Contacts */}
          <div className="frosted-glass p-4">
            <h3 className="font-semibold text-white mb-3">📞 Emergency Contacts</h3>
            <div className="space-y-2 text-sm">
              {content.contacts.map((contact, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <span className="text-green-400">📞</span>
                  <span>{contact}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Disclaimer */}
          <div className="frosted-glass p-4 border border-yellow-400/30">
            <h3 className="font-semibold text-yellow-400 mb-3">⚠️ Important Disclaimer</h3>
            <p className="text-sm">
              This information is for educational purposes only and does not constitute legal advice. 
              Laws and protections vary by jurisdiction. Consider consulting with a legal professional 
              familiar with local whistleblower laws before making reports that could have significant 
              legal implications.
            </p>
          </div>
        </div>

        <div className="mt-8 flex justify-center space-x-4">
          <button
            onClick={onClose}
            className="btn-primary-gradient px-8 py-3 rounded-lg font-semibold"
          >
            I Understand My Rights
          </button>
          <button
            onClick={() => window.open('https://www.transparency.org', '_blank')}
            className="btn-secondary-gradient px-8 py-3 rounded-lg font-semibold"
          >
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
};

export default EduModal;
