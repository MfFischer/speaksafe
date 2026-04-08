import React, { createContext, useContext, ReactNode } from 'react';
import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react';
import { mainnet, polygon, hardhat } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';

// 1. Get projectId at https://cloud.walletconnect.com
const projectId = '8124505183864456982041865758084'; // Placeholder

// 2. Create wagmiConfig
const metadata = {
  name: 'SpeakSafe',
  description: 'Anonymous Whistleblowing Platform',
  url: 'https://speaksafe.tech',
  icons: ['https://speaksafe.tech/logo.png']
};

const chains = [mainnet, polygon, hardhat] as const;
const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
});

// 3. Create modal
createWeb3Modal({
  wagmiConfig: config,
  projectId,
  enableAnalytics: true,
  themeMode: 'dark',
});

const queryClient = new QueryClient();

interface Web3ContextType {
  // Add custom wallet state helpers if needed
}

const Web3Context = createContext<Web3ContextType | null>(null);

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) throw new Error('useWeb3 must be used within a Web3Provider');
  return context;
};

export const Web3Provider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <Web3Context.Provider value={{}}>
          {children}
        </Web3Context.Provider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
