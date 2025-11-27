'use client';

import { createContext, useContext, useState } from "react"

interface WalletState{
  walletAddress: string | undefined;
  isConnected: boolean;
  setWalletAddress: (address: string | undefined) => void;
  setIsConnected: (connected: boolean) => void;
}

const WalletContext = createContext<WalletState | null>(null);

const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const [walletAddress, setWalletAddress] = useState<string | undefined>(undefined);
  const [isConnected, setIsConnected] = useState<boolean>(false);  

  const initialState:WalletState = {
    walletAddress,
    isConnected,
    setWalletAddress,
    setIsConnected,
  }

  return (
    <WalletContext.Provider value={initialState}>
      {children}
    </WalletContext.Provider>
  )
}

export default WalletProvider


export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}
