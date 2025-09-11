import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DonationDashboard from '../components/donation/DonationDashboard';
import DonationModal from '../components/donation/DonationModal';

const DonatePage: React.FC = () => {
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);

  const handleDonationSuccess = (amount: number, currency: string) => {
    // Handle successful donation - could show toast, update stats, etc.
    console.log(`Donation successful: ${amount} ${currency}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Header */}
      <header className="bg-gray-900/90 backdrop-blur-sm py-4 px-6 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="text-white text-2xl font-bold">
            SpeakSafe
          </Link>
          <nav className="space-x-6">
            <Link to="/" className="text-white hover:text-purple-300 transition-colors font-medium">Home</Link>
            <Link to="/report" className="text-white hover:text-purple-300 transition-colors font-medium">Report</Link>
            <Link to="/dao" className="text-white hover:text-purple-300 transition-colors font-medium">DAO</Link>
            <Link to="/donate" className="text-white hover:text-purple-300 transition-colors font-semibold">Donate</Link>
            <Link to="/settings" className="text-white hover:text-purple-300 transition-colors font-medium">Settings</Link>
          </nav>
        </div>
      </header>

      <div className="pt-8 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <DonationDashboard onDonateClick={() => setIsDonationModalOpen(true)} />
        </div>
      </div>

      <DonationModal
        isOpen={isDonationModalOpen}
        onClose={() => setIsDonationModalOpen(false)}
        onSuccess={handleDonationSuccess}
      />
    </div>
  );
};

export default DonatePage;
