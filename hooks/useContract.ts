'use client';

import { useState, useEffect, useCallback } from 'react';
import { formatEther } from 'viem';
import {
  getPrice,
  getMinimumDollarWei,
  getOwner,
  getContractBalance,
  getAddressFunded,
  fundContract,
  withdrawContract,
} from '@/lib/contract';
import { useWallet } from '@/context/WalletProvider';
import { publicClient } from '@/lib/viem';

export const useContract = () => {
  const { address, isConnected } = useWallet();
  
  const [ethPrice, setEthPrice] = useState<string>('0');
  const [minDepositUSD, setMinDepositUSD] = useState<string>('0');
  const [minDepositETH, setMinDepositETH] = useState<string>('0');
  const [contractBalance, setContractBalance] = useState<string>('0');
  const [userBalance, setUserBalance] = useState<string>('0');
  const [userFunded, setUserFunded] = useState<string>('0');
  const [owner, setOwner] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);

  // Fetch all contract data
  const fetchContractData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Get ETH price (returns with 8 decimals from Chainlink)
      const priceWei = await getPrice();
      const priceUSD = Number(priceWei) / 1e8; // Chainlink uses 8 decimals
      setEthPrice(priceUSD.toFixed(2));

      // Get minimum deposit in USD (returns with 18 decimals)
      const minUSD = await getMinimumDollarWei();
      const minUSDFormatted = Number(minUSD) / 1e18;
      setMinDepositUSD(minUSDFormatted.toFixed(2));

      // Calculate minimum deposit in ETH
      if (priceUSD > 0) {
        const minETH = minUSDFormatted / priceUSD;
        setMinDepositETH(minETH.toFixed(6));
      }

      // Get contract balance
      const balance = await getContractBalance();
      setContractBalance(formatEther(balance));

      // Get owner
      const ownerAddr = await getOwner();
      setOwner(ownerAddr);
      
      // Check if connected user is owner
      if (address) {
        setIsOwner(address.toLowerCase() === ownerAddr.toLowerCase());
      }

      // Get user's funded amount if connected
      if (address) {
        const funded = await getAddressFunded(address);
        setUserFunded(formatEther(funded));
        
        // Get user's wallet balance
        const walletBalance = await publicClient.getBalance({ address: address as `0x${string}` });
        setUserBalance(formatEther(walletBalance));
      }
    } catch (error) {
      console.error('Error fetching contract data:', error);
    } finally {
      setLoading(false);
    }
  }, [address]);

  // Fund the contract
  const fund = async (ethAmount: string) => {
    if (!isConnected) {
      throw new Error('Wallet not connected');
    }

    if (!ethAmount || parseFloat(ethAmount) <= 0) {
      throw new Error('Invalid amount');
    }

    try {
      const txHash = await fundContract(ethAmount);
      
      // Wait for transaction confirmation
      await publicClient.waitForTransactionReceipt({ hash: txHash as `0x${string}` });
      
      // Refresh data after transaction
      await fetchContractData();
      
      return txHash;
    } catch (error: any) {
      console.error('Fund error:', error);
      throw new Error(error.message || 'Failed to fund contract');
    }
  };

  // Withdraw from contract (owner only)
  const withdraw = async () => {
    if (!isConnected) {
      throw new Error('Wallet not connected');
    }

    if (!isOwner) {
      throw new Error('Only owner can withdraw');
    }

    try {
      const txHash = await withdrawContract();
      
      // Wait for transaction confirmation
      await publicClient.waitForTransactionReceipt({ hash: txHash as `0x${string}` });
      
      // Refresh data after transaction
      await fetchContractData();
      
      return txHash;
    } catch (error: any) {
      console.error('Withdraw error:', error);
      throw new Error(error.message || 'Failed to withdraw');
    }
  };

  // Initial fetch and refresh on address change
  useEffect(() => {
    fetchContractData();
  }, [fetchContractData]);

  return {
    ethPrice,
    minDepositUSD,
    minDepositETH,
    contractBalance,
    userBalance,
    userFunded,
    owner,
    isOwner,
    loading,
    fund,
    withdraw,
    refresh: fetchContractData,
  };
};
