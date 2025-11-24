'use client';

import { useState, useEffect, useCallback } from 'react';
import { formatEther } from 'viem';
import {
  getPrice,
  getMinimumDollarWei,
  getOwner,
  getContractBalance,
  getAddressFunded,
  getFunderByIndex,
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
  const [backersCount, setBackersCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);

  // Fetch all contract data
  const fetchContractData = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Fetching contract data...');
      
      // Fetch contract data in parallel for better performance
      const [priceWei, minUSD, balance, ownerAddr] = await Promise.all([
        getPrice().catch((e) => { console.error('Price fetch error:', e); return BigInt(0); }),
        getMinimumDollarWei().catch((e) => { console.error('MinUSD fetch error:', e); return BigInt(0); }),
        getContractBalance().catch((e) => { console.error('Balance fetch error:', e); return BigInt(0); }),
        getOwner().catch((e) => { console.error('Owner fetch error:', e); return ''; }),
      ]);

      console.log('Contract balance (raw):', balance.toString());
      console.log('ETH Price (raw):', priceWei.toString());

      // Get ETH price - Chainlink price feeds typically use 8 decimals
      // But we need to check what the contract actually returns
      let priceUSD = Number(priceWei) / 1e8; // Try 8 decimals (standard Chainlink)
      
      // If unreasonably high, try 18 decimals
      if (priceUSD > 1000000) {
        priceUSD = Number(priceWei) / 1e18;
      }
      
      console.log('ETH Price USD:', priceUSD);
      setEthPrice(priceUSD.toFixed(2));

      // Get minimum deposit in USD (returns with 18 decimals)
      const minUSDFormatted = Number(minUSD) / 1e18;
      setMinDepositUSD(minUSDFormatted.toFixed(2));

      // Calculate minimum deposit in ETH
      if (priceUSD > 0) {
        const minETH = minUSDFormatted / priceUSD;
        setMinDepositETH(minETH.toFixed(6));
      }

      // Set contract balance
      const formattedBalance = formatEther(balance);
      console.log('Contract balance (formatted):', formattedBalance);
      setContractBalance(formattedBalance);

      // Set owner
      setOwner(ownerAddr);
      
      // Count unique backers by iterating through funders array
      let backersCounter = 0;
      const uniqueFunders = new Set<string>();
      
      for (let i = 0; i < 100; i++) {
        try {
          const funderAddress = await getFunderByIndex(i);
          if (funderAddress && !uniqueFunders.has(funderAddress.toLowerCase())) {
            uniqueFunders.add(funderAddress.toLowerCase());
            backersCounter++;
          }
        } catch {
          // Reached end of funders array
          break;
        }
      }
      
      setBackersCount(backersCounter);
      console.log('Total unique backers:', backersCounter);
      
      // Check if connected user is owner and fetch user-specific data
      if (address) {
        setIsOwner(address.toLowerCase() === ownerAddr.toLowerCase());
        
        // Fetch user-specific data in parallel
        const [funded, walletBalance] = await Promise.all([
          getAddressFunded(address).catch(() => BigInt(0)),
          publicClient.getBalance({ address: address as `0x${string}` }).catch(() => BigInt(0)),
        ]);
        
        setUserFunded(formatEther(funded));
        setUserBalance(formatEther(walletBalance));
      } else {
        setUserFunded('0');
        setUserBalance('0');
        setIsOwner(false);
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
    } catch (error) {
      console.error('Fund error:', error);
      const err = error as Error;
      throw new Error(err.message || 'Failed to fund contract');
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
    } catch (error) {
      console.error('Withdraw error:', error);
      const err = error as Error;
      throw new Error(err.message || 'Failed to withdraw');
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
    backersCount,
    loading,
    fund,
    withdraw,
    refresh: fetchContractData,
  };
};
