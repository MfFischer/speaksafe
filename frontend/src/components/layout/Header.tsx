import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Shield, Home, FileText, Users, Settings } from 'lucide-react';
import { Button } from '../ui';

const W3mButton = 'w3m-button' as any;

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Report', href: '/report', icon: FileText },
    { name: 'DAO', href: '/dao', icon: Users },
    { name: 'Donate', href: '/donate', icon: Shield },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-bg-primary/80 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative h-10 w-10 overflow-hidden rounded-xl border border-white/10 shadow-glass group-hover:scale-110 transition-transform duration-500">
              <img src="/logo-premium.png" alt="SpeakSafe Logo" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-white tracking-widest uppercase">SpeakSafe</span>
              <span className="text-[8px] font-bold text-accent-mid tracking-[0.3em] uppercase -mt-1 opacity-80">Network</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            <nav className="flex items-center space-x-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                      isActive(item.href)
                        ? 'bg-white/10 text-white font-semibold'
                        : 'text-text-muted hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon size={16} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="h-6 w-[1px] bg-white/10 mx-2" />
            <W3mButton />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-3">
            <W3mButton />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              icon={isMobileMenuOpen ? X : Menu}
            >
              {isMobileMenuOpen ? '' : ''}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-bg-secondary/95 backdrop-blur-xl border-b border-white/10"
          >
            <div className="px-4 py-4 space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                      isActive(item.href)
                        ? 'bg-white/10 text-white font-semibold'
                        : 'text-text-secondary hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon size={20} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
