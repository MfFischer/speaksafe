import React from 'react';
import Header from './Header';
import ParticleBackground from '../particleBackground';

interface LayoutProps {
  children: React.ReactNode;
  showParticles?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, showParticles = true }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-tertiary">
      {showParticles && <ParticleBackground />}
      <Header />
      <main className="pt-16 relative z-10">
        {children}
      </main>
    </div>
  );
};

export default Layout;
