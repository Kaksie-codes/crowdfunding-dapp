// context/WalletProvider.tsx
'use client';


import React, { createContext, useContext, useEffect, useState } from 'react';
import type { WalletClient } from 'viem';
import { createWalletClientForWindowEthereum } from '@/lib/viem';

// Define a type for the Ethereum provider injected by MetaMask
type EthereumProvider = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on?: (event: string, handler: (...args: unknown[]) => void) => void;
  removeListener?: (event: string, handler: (...args: unknown[]) => void) => void;
};

type WalletState = {
  address: string | null;
  chainId: number | null;
  isConnected: boolean;
  walletClient: WalletClient | null;
  connect: () => Promise<void>;
  disconnect: () => void;
};

const WalletContext = createContext<WalletState>({
  address: null,
  chainId: null,
  isConnected: false,
  walletClient: null,
  connect: async () => {},
  disconnect: () => {},
});

export const useWallet = () => useContext(WalletContext);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [address, setAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [walletClient, setWalletClient] = useState<WalletClient | null>(null);

  // connect function - ask MetaMask for accounts and build walletClient
  const connect = async () => {
    if (typeof window === 'undefined') return;
    const provider = (window.ethereum as EthereumProvider | undefined);
    if (!provider) {
      alert('No Ethereum provider found. Install MetaMask.');
      return;
    }

    try {
      // request accounts
      const accounts = await provider.request({ method: 'eth_requestAccounts' }) as string[];
      const acct = accounts[0];
      setAddress(acct);

      // chain id
      const chain = await provider.request({ method: 'eth_chainId' }) as string;
      setChainId(Number(chain));

      // create wallet client
      const wc = createWalletClientForWindowEthereum();
      setWalletClient(wc);
    } catch (err) {
      console.error('Wallet connect error', err);
    }
  };

  const disconnect = () => {
    setAddress(null);
    setChainId(null);
    setWalletClient(null);
  };

  // listen to account & chain changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const provider = (window.ethereum as EthereumProvider | undefined);
    if (!provider) return;


    // Use rest parameters and type guards to ensure correct types
    const handleAccounts = (...args: unknown[]) => {
      const accounts = args[0];
      if (Array.isArray(accounts) && accounts.every(a => typeof a === 'string')) {
        if (accounts.length === 0) {
          disconnect();
        } else {
          setAddress(accounts[0]);
        }
      }
    };

    const handleChain = (...args: unknown[]) => {
      const chainHex = args[0];
      if (typeof chainHex === 'string') {
        setChainId(Number(chainHex));
      }
    };

    provider.on?.('accountsChanged', handleAccounts);
    provider.on?.('chainChanged', handleChain);

    return () => {
      provider.removeListener?.('accountsChanged', handleAccounts);
      provider.removeListener?.('chainChanged', handleChain);
    };
  }, []);

  // optional: try to detect existing connected account on mount
  useEffect(() => {
    (async () => {
      if (typeof window === 'undefined') return;
      const provider = (window.ethereum as EthereumProvider | undefined);
      if (!provider) return;
      try {
        const accounts = await provider.request({ method: 'eth_accounts' }) as string[];
        if (accounts.length) setAddress(accounts[0]);
        const chain = await provider.request({ method: 'eth_chainId' }) as string;
        if (chain) setChainId(Number(chain));
        // do not create wallet client until user explicitly connects (we create in connect())
      } catch {
        // ignore
      }
    })();
  }, []);

  return (
    <WalletContext.Provider
      value={{
        address,
        chainId,
        isConnected: !!address,
        walletClient,
        connect,
        disconnect,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
