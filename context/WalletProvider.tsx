'use client';

import { getConnectedAddress } from "@/lib/getConnectedWallet";
import type { Address } from "viem";
import { createContext, useContext, useEffect, useState } from "react"

interface WalletState{
  walletAddress: Address | undefined;
  isConnected: boolean;
  setWalletAddress: (address: Address | undefined) => void;
  setIsConnected: (connected: boolean) => void;
}

const WalletContext = createContext<WalletState | null>(null);

const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const [walletAddress, setWalletAddress] = useState<Address | undefined>(undefined);
  const [isConnected, setIsConnected] = useState<boolean>(false);  

  const initialState:WalletState = {
    walletAddress,
    isConnected,
    setWalletAddress,
    setIsConnected,
  }

  useEffect(() => {
    const checkWallet = async () => {
      if (window.ethereum) {
        console.log("Ethereum wallet is available", window.ethereum);
        const connectedWallet = await getConnectedAddress();
        if (connectedWallet) {
          setWalletAddress(connectedWallet);
          setIsConnected(true);
        }
      }
    };
    
    checkWallet();
  }, [])

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
