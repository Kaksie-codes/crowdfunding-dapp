'use client';

import { checkWalletConnectionStatus } from '@/lib/checkWalletConnectionStatus';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import type { Address } from 'viem';

interface WalletState {
  walletAddress: Address | undefined;
  setWalletAddress: (address: Address | undefined) => void;
  isConnected: boolean;
  setIsConnected: (connected: boolean) => void;
} 



export const WalletContext = createContext<WalletState>({
  walletAddress: undefined,
  setWalletAddress: () => {},
  isConnected: false,
  setIsConnected: () => {},
});

const WalletProvider = ({children}: {children: ReactNode}) => {
  const [walletAddress, setWalletAddress] = useState<Address | undefined>(undefined);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  const initialState: WalletState = {
    walletAddress,
    setWalletAddress,
    isConnected,
    setIsConnected,
  };

  useEffect(() => {
    async function CheckWalletConnection(){
      const connectedWallet = await checkWalletConnectionStatus();
      if(connectedWallet){
        setWalletAddress(connectedWallet);
        setIsConnected(true);
      }
    }
    CheckWalletConnection();
  }, []);

  return (
    <WalletContext.Provider value={initialState}>
      {children}
    </WalletContext.Provider>
  )
}

export default WalletProvider


export const useWalletContext = () => {
  return useContext(WalletContext);
}
