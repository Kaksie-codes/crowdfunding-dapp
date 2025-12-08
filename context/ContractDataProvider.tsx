'use client';

import { createContext, useContext, useCallback, useEffect, useState, ReactNode } from 'react';
import { useWalletContext } from '@/context/WalletProvider';
import { getContractBalance, getETHPrice, getMinDepositUSD, getNumberOfFunders, getWalletBalance } from '@/lib/contract';

interface ContractDataContextType {
  ethPrice: string;
  numOfBackers: number;
  totalFundsRaised: string;
  walletBalance: string;
  minDepositUSD: string;
  isLoading: boolean;
  refresh: () => Promise<void>;
}

const ContractDataContext = createContext<ContractDataContextType | undefined>(undefined);

export const useContractData = () => {
  const ctx = useContext(ContractDataContext);
  if (!ctx) throw new Error('useContractData must be used within a ContractDataProvider');
  return ctx;
};

export const ContractDataProvider = ({ children }: { children: ReactNode }) => {
  const { walletAddress } = useWalletContext();
  const [ethPrice, setEthPrice] = useState<string>('');
  const [numOfBackers, setNumOfBackers] = useState<number>(0);
  const [totalFundsRaised, setTotalFundsRaised] = useState<string>('');
  const [walletBalance, setWalletBalance] = useState<string>('');
  const [minDepositUSD, setMinDepositUSD] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getContractData = useCallback(async () => {
    if (!walletAddress) return;
    setIsLoading(true);
    try {
      const [
        _ethPrice,
        _numOfBackers,
        _contractBalance,
        _walletBalance,
        _minDepositUSD,
      ] = await Promise.all([
        getETHPrice(),
        getNumberOfFunders(),
        getContractBalance(),
        getWalletBalance(walletAddress),
        getMinDepositUSD(),
      ]);
      setEthPrice(_ethPrice);
      setNumOfBackers(_numOfBackers);
      setTotalFundsRaised(_contractBalance);
      setWalletBalance(_walletBalance);
      setMinDepositUSD(_minDepositUSD);
    } catch (error) {
      console.log('Error loading contract data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [walletAddress]);

  useEffect(() => {
    getContractData();
  }, [getContractData]);

  return (
    <ContractDataContext.Provider
      value={{
        ethPrice,
        numOfBackers,
        totalFundsRaised,
        walletBalance,
        minDepositUSD,
        isLoading,
        refresh: getContractData,
      }}
    >
      {children}
    </ContractDataContext.Provider>
  );
};
