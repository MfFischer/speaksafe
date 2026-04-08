import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ethers } from 'ethers';
import {
  Wallet,
  X,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Shield
} from 'lucide-react';

// Polygon Mumbai testnet — switch to 137 (mainnet) for production.
const TARGET_CHAIN_ID = parseInt(process.env.REACT_APP_CHAIN_ID || '80001', 10);

const POLYGON_NETWORKS: Record<number, { chainName: string; rpcUrls: string[]; nativeCurrency: { name: string; symbol: string; decimals: number }; blockExplorerUrls: string[] }> = {
  80001: {
    chainName: 'Polygon Mumbai Testnet',
    rpcUrls: ['https://rpc-mumbai.maticvigil.com/'],
    nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
    blockExplorerUrls: ['https://mumbai.polygonscan.com/']
  },
  137: {
    chainName: 'Polygon Mainnet',
    rpcUrls: ['https://polygon-rpc.com/'],
    nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
    blockExplorerUrls: ['https://polygonscan.com/']
  }
};

interface WalletOption {
  id: string;
  name: string;
  icon: string;
  description: string;
  installed?: boolean;
  mobile?: boolean;
}

function getWalletOptions(): WalletOption[] {
  const eth = (window as any).ethereum;
  return [
    {
      id: 'metamask',
      name: 'MetaMask',
      icon: '🦊',
      description: 'Most popular Ethereum wallet',
      installed: !!eth?.isMetaMask
    },
    {
      id: 'walletconnect',
      name: 'WalletConnect',
      icon: '🔗',
      description: 'Connect with mobile wallets',
      mobile: true
    },
    {
      id: 'coinbase',
      name: 'Coinbase Wallet',
      icon: '🔵',
      description: 'User-friendly for beginners',
      installed: !!eth?.isCoinbaseWallet
    },
    {
      id: 'trust',
      name: 'Trust Wallet',
      icon: '🛡️',
      description: 'Mobile-first secure wallet',
      mobile: true
    }
  ];
}

/** Switch (or add) the Polygon network inside MetaMask. */
async function ensurePolygonNetwork(provider: any): Promise<void> {
  const targetHex = `0x${TARGET_CHAIN_ID.toString(16)}`;
  try {
    await provider.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: targetHex }] });
  } catch (err: any) {
    // 4902 = chain not added yet
    if (err.code === 4902) {
      const net = POLYGON_NETWORKS[TARGET_CHAIN_ID];
      await provider.request({
        method: 'wallet_addEthereumChain',
        params: [{ chainId: targetHex, ...net }]
      });
    } else {
      throw err;
    }
  }
}

export interface ConnectedWallet {
  address: string;
  chainId: number;
  provider: ethers.providers.Web3Provider;
  signer: ethers.Signer;
}

interface WalletConnectProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (wallet: ConnectedWallet) => void;
}

const WalletConnect: React.FC<WalletConnectProps> = ({ isOpen, onClose, onConnect }) => {
  const [walletOptions, setWalletOptions] = useState<WalletOption[]>([]);
  const [connecting, setConnecting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) setWalletOptions(getWalletOptions());
  }, [isOpen]);

  const connectMetaMask = async () => {
    const eth = (window as any).ethereum;
    if (!eth) throw new Error('MetaMask is not installed. Please install it from metamask.io.');

    // Request account access
    await eth.request({ method: 'eth_requestAccounts' });

    // Switch to the target Polygon network
    await ensurePolygonNetwork(eth);

    const provider = new ethers.providers.Web3Provider(eth, 'any');
    const signer   = provider.getSigner();
    const address  = await signer.getAddress();
    const network  = await provider.getNetwork();

    return { address, chainId: network.chainId, provider, signer };
  };

  const connectCoinbase = async () => {
    const eth = (window as any).ethereum;
    if (!eth?.isCoinbaseWallet) throw new Error('Coinbase Wallet is not installed.');

    await eth.request({ method: 'eth_requestAccounts' });
    await ensurePolygonNetwork(eth);

    const provider = new ethers.providers.Web3Provider(eth, 'any');
    const signer   = provider.getSigner();
    const address  = await signer.getAddress();
    const network  = await provider.getNetwork();

    return { address, chainId: network.chainId, provider, signer };
  };

  const handleWalletConnect = async (walletId: string) => {
    setConnecting(walletId);
    setError(null);

    try {
      let result: ConnectedWallet;

      if (walletId === 'metamask') {
        result = await connectMetaMask();
      } else if (walletId === 'coinbase') {
        result = await connectCoinbase();
      } else {
        // WalletConnect and Trust Wallet require the WalletConnect v2 SDK.
        // TODO: integrate @walletconnect/modal once a project ID is configured.
        throw new Error(`${walletId === 'walletconnect' ? 'WalletConnect' : 'Trust Wallet'} support is coming soon. Please use MetaMask for now.`);
      }

      onConnect(result);
      onClose();
    } catch (err: any) {
      // User rejected the request — not an error worth alarming about.
      if (err.code === 4001) {
        setError('Connection cancelled.');
      } else {
        setError(err.message || 'Failed to connect wallet.');
      }
    } finally {
      setConnecting(null);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-accent-dark to-accent-mid rounded-full flex items-center justify-center">
                    <Wallet className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Connect Wallet</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Choose your preferred wallet</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Security Notice */}
                <div className="mb-6 p-4 bg-blue-50 dark:bg-white/5 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-accent-bright dark:text-accent-bright mt-0.5 shrink-0" />
                    <div>
                      <h3 className="text-sm font-medium text-accent-bright dark:text-text-primary">Your Privacy is Protected</h3>
                      <p className="text-xs text-accent-bright dark:text-text-primary mt-1">
                        SpeakSafe uses zero-knowledge proofs so your wallet address is never linked to your report.
                        Connecting a wallet is only required to pay gas fees.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800"
                  >
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
                      <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                    </div>
                  </motion.div>
                )}

                {/* Wallet Options */}
                <div className="space-y-3">
                  {walletOptions.map((wallet) => (
                    <motion.button
                      key={wallet.id}
                      onClick={() => handleWalletConnect(wallet.id)}
                      disabled={connecting !== null}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-violet-300 dark:hover:border-violet-600 hover:bg-violet-50 dark:hover:bg-white/5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-left"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="text-2xl">{wallet.icon}</div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium text-gray-900 dark:text-white">{wallet.name}</h3>
                              {wallet.installed && (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              )}
                              {wallet.mobile && (
                                <span className="px-2 py-0.5 text-xs bg-accent-mid dark:bg-accent-mid text-accent-bright dark:text-text-primary rounded-full">
                                  Mobile
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{wallet.description}</p>
                          </div>
                        </div>

                        {connecting === wallet.id ? (
                          <div className="w-6 h-6 border-2 border-violet-600 border-t-transparent rounded-full animate-spin shrink-0" />
                        ) : wallet.id === 'metamask' && !wallet.installed ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open('https://metamask.io/download/', '_blank');
                            }}
                            className="px-3 py-1 text-xs bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 rounded-full hover:bg-orange-200 dark:hover:bg-orange-800 transition-colors shrink-0"
                          >
                            Install
                          </button>
                        ) : (
                          <ExternalLink className="w-4 h-4 text-gray-400 shrink-0" />
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>

                {/* Help Text */}
                <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">New to crypto wallets?</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                    A crypto wallet lets you interact with blockchain applications. We recommend MetaMask for desktop users.
                    No wallet? Use the sponsored reporting option — no gas fees needed.
                  </p>
                  <button
                    onClick={() => window.open('https://ethereum.org/en/wallets/', '_blank')}
                    className="text-xs text-accent-bright dark:text-accent-bright hover:text-accent-bright dark:hover:text-text-primary font-medium"
                  >
                    Learn more about wallets →
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default WalletConnect;
