import React, { useState } from 'react';
import '../assets/gradient.css';
import '../assets/animations.css';

interface LegalDisclaimerProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
  region?: 'indonesia' | 'nepal' | 'bangladesh' | 'philippines' | 'general';
}

const LegalDisclaimer: React.FC<LegalDisclaimerProps> = ({ 
  isOpen, 
  onClose, 
  onAccept, 
  region = 'general' 
}) => {
  // const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);

  if (!isOpen) return null;

  // const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
  //   const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
  //   if (scrollTop + clientHeight >= scrollHeight - 10) {
  //     setHasScrolledToBottom(true);
  //   }
  // };

  const getRegionalWarnings = () => {
    switch (region) {
      case 'indonesia':
        return {
          title: 'Important Legal Notice for Indonesia',
          warnings: [
            'Indonesian law provides some protection for whistleblowers under Law No. 13 of 2006, but enforcement can be inconsistent.',
            'Corruption cases involving high-level officials may carry additional risks.',
            'Consider the political climate and local power structures before reporting.',
            'The Corruption Eradication Commission (KPK) has jurisdiction over corruption cases.'
          ]
        };
      case 'philippines':
        return {
          title: 'Important Legal Notice for Philippines',
          warnings: [
            'The Philippines has limited whistleblower protection laws compared to other countries.',
            'Political retaliation is a significant risk, especially for cases involving elected officials.',
            'The Ombudsman has authority over government corruption cases.',
            'Consider consulting with human rights organizations before proceeding.'
          ]
        };
      default:
        return {
          title: 'Important Legal Notice',
          warnings: [
            'Whistleblower protection laws vary significantly by country and jurisdiction.',
            'Some regions may have limited or poorly enforced protection laws.',
            'Political and economic retaliation risks vary by local context.',
            'Consider consulting local legal experts familiar with whistleblower protections.'
          ]
        };
    }
  };

  const regionalContent = getRegionalWarnings();

  const sections = [
    {
      title: 'Platform Disclaimer',
      content: (
        <div className="space-y-4">
          <p className="text-text-primary">
            SpeakSafe is a decentralized platform designed to facilitate anonymous reporting of corruption, 
            fraud, and misconduct. While we employ advanced cryptographic techniques to protect user anonymity, 
            we cannot guarantee absolute anonymity or protection from all forms of retaliation.
          </p>
          <div className="frosted-glass p-4">
            <h4 className="font-semibold text-white mb-2">Technical Limitations:</h4>
            <ul className="text-text-primary text-sm space-y-1">
              <li>• Blockchain transactions may be subject to network analysis</li>
              <li>• Internet service providers may log connection data</li>
              <li>• Device fingerprinting and other tracking methods exist</li>
              <li>• Government surveillance capabilities vary by jurisdiction</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: 'Legal Risks and Considerations',
      content: (
        <div className="space-y-4">
          <div className="frosted-glass p-4 border border-yellow-400/30">
            <h4 className="font-semibold text-yellow-400 mb-2">{regionalContent.title}</h4>
            <ul className="text-text-primary text-sm space-y-2">
              {regionalContent.warnings.map((warning, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="text-yellow-400 mt-1">⚠️</span>
                  <span>{warning}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="frosted-glass p-4">
            <h4 className="font-semibold text-white mb-2">General Risks:</h4>
            <ul className="text-text-primary text-sm space-y-1">
              <li>• Employment termination or demotion</li>
              <li>• Legal intimidation or harassment</li>
              <li>• Social ostracism or reputation damage</li>
              <li>• Physical threats or violence in extreme cases</li>
              <li>• Financial retaliation or blacklisting</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: 'User Responsibilities',
      content: (
        <div className="space-y-4">
          <p className="text-text-primary">
            By using SpeakSafe, you acknowledge that you are solely responsible for:
          </p>
          <div className="frosted-glass p-4">
            <ul className="text-text-primary text-sm space-y-2">
              <li>• Ensuring the accuracy and truthfulness of your reports</li>
              <li>• Understanding local laws and regulations regarding whistleblowing</li>
              <li>• Assessing personal risks before submitting reports</li>
              <li>• Taking appropriate security measures to protect your identity</li>
              <li>• Consulting with legal professionals when necessary</li>
              <li>• Not using the platform for malicious, false, or defamatory purposes</li>
            </ul>
          </div>
          <div className="frosted-glass p-4 border border-red-400/30">
            <h4 className="font-semibold text-red-400 mb-2">Prohibited Uses:</h4>
            <ul className="text-text-primary text-sm space-y-1">
              <li>• Submitting false or misleading information</li>
              <li>• Personal vendettas or harassment</li>
              <li>• Violation of attorney-client or other privileged communications</li>
              <li>• Disclosure of classified national security information</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: 'Limitation of Liability',
      content: (
        <div className="space-y-4">
          <div className="frosted-glass p-4">
            <h4 className="font-semibold text-white mb-2">SpeakSafe and its operators:</h4>
            <ul className="text-text-primary text-sm space-y-2">
              <li>• Cannot guarantee protection from legal or physical retaliation</li>
              <li>• Are not responsible for consequences of your reports</li>
              <li>• Cannot provide legal advice or representation</li>
              <li>• May be subject to legal orders requiring data disclosure</li>
              <li>• Cannot control how authorities or organizations respond to reports</li>
            </ul>
          </div>
          <p className="text-text-primary text-sm">
            <strong>This platform is provided "as is" without warranties of any kind.</strong> Users assume 
            all risks associated with whistleblowing activities. We strongly recommend consulting with 
            qualified legal professionals before submitting reports that could have significant legal implications.
          </p>
        </div>
      )
    },
    {
      title: 'Emergency Situations',
      content: (
        <div className="space-y-4">
          <div className="frosted-glass p-4 border border-red-400/30">
            <h4 className="font-semibold text-red-400 mb-2">⚠️ If You Are in Immediate Danger:</h4>
            <ul className="text-text-primary text-sm space-y-2">
              <li>• Contact local emergency services immediately</li>
              <li>• Reach out to human rights organizations</li>
              <li>• Consider seeking asylum or protection if necessary</li>
              <li>• Do not rely solely on digital platforms for protection</li>
            </ul>
          </div>
          <div className="frosted-glass p-4">
            <h4 className="font-semibold text-white mb-2">Emergency Contacts:</h4>
            <ul className="text-text-primary text-sm space-y-1">
              <li>• International: UN Human Rights Office (+41-22-917-9000)</li>
              <li>• Transparency International (+49-30-34-38-200)</li>
              <li>• Local human rights organizations</li>
              <li>• Embassy or consulate of your country if abroad</li>
            </ul>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="frosted-glass max-w-4xl w-full max-h-[90vh] flex flex-col p-8 modal-enter">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Legal Disclaimer & Risk Warning</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-text-primary text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Section Navigation */}
        <div className="flex flex-wrap gap-2 mb-6">
          {sections.map((section, index) => (
            <button
              key={index}
              onClick={() => setCurrentSection(index)}
              className={`px-3 py-1 rounded-lg text-sm font-semibold transition-all ${
                currentSection === index
                  ? 'btn-primary-gradient text-white'
                  : 'text-text-primary hover:text-white hover:bg-white/5'
              }`}
            >
              {index + 1}. {section.title}
            </button>
          ))}
        </div>

        {/* Content */}
        <div
          className="flex-1 overflow-y-auto space-y-4 mb-6"
        >
          <div className="animate-fade-in">
            <h3 className="text-xl font-semibold text-white mb-4">
              {sections[currentSection].title}
            </h3>
            {sections[currentSection].content}
          </div>
        </div>

        {/* Navigation and Actions */}
        <div className="flex justify-between items-center pt-4 border-t border-white/10">
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
              disabled={currentSection === 0}
              className="btn-secondary-gradient px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentSection(Math.min(sections.length - 1, currentSection + 1))}
              disabled={currentSection === sections.length - 1}
              className="btn-secondary-gradient px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50"
            >
              Next
            </button>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={onClose}
              className="text-text-primary hover:text-white px-4 py-2 text-sm font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={onAccept}
              className="btn-primary-gradient px-6 py-2 rounded-lg text-sm font-semibold"
            >
              I Understand the Risks
            </button>
          </div>
        </div>

        <div className="text-center mt-4">
          <p className="text-text-primary text-xs">
            By proceeding, you acknowledge that you have read, understood, and accept these terms and risks.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LegalDisclaimer;
