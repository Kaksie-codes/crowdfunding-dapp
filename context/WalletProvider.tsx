// context/WalletProvider.tsx
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import type { WalletClient } from 'viem';
import { createWalletClientForWindowEthereum } from '@/lib/viem';
import { publicClient } from '@/lib/viem';

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
    // @ts-ignore
    const provider = (window as any).ethereum;
    if (!provider) {
      alert('No Ethereum provider found. Install MetaMask.');
      return;
    }

    try {
      // request accounts
      const accounts: string[] = await provider.request({ method: 'eth_requestAccounts' });
      const acct = accounts[0];
      setAddress(acct);

      // chain id
      const chain = await provider.request({ method: 'eth_chainId' });
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
    // @ts-ignore
    const provider = (window as any).ethereum;
    if (!provider) return;

    const handleAccounts = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnect();
      } else {
        setAddress(accounts[0]);
      }
    };

    const handleChain = (chainHex: string) => {
      setChainId(Number(chainHex));
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
      // @ts-ignore
      const provider = (window as any).ethereum;
      if (!provider) return;
      try {
        const accounts: string[] = await provider.request({ method: 'eth_accounts' });
        if (accounts.length) setAddress(accounts[0]);
        const chain = await provider.request({ method: 'eth_chainId' });
        if (chain) setChainId(Number(chain));
        // do not create wallet client until user explicitly connects (we create in connect())
      } catch (err) {
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
