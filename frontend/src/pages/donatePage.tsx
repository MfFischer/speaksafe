import React, { useState } from 'react';
import Header from '../components/layout/Header';
import DonationDashboard from '../components/donation/DonationDashboard';
import DonationModal from '../components/donation/DonationModal';

const DonatePage: React.FC = () => {
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);

  const handleDonationSuccess = (amount: number, currency: string) => {
    // Handle successful donation - could show toast, update stats, etc.
    console.log(`Donation successful: ${amount} ${currency}`);
  };

  return (
    <div className="min-h-screen bg-transparent pt-16">
      <Header />

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
