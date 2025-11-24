'use client';

import { useState, useEffect, useCallback } from 'react';
import { formatEther } from 'viem';
import { getFunderByIndex, getAddressFunded } from '@/lib/contract';

export interface Funder {
  wallet: string;
  total: number;
  timeStamp: number;
}

export interface Transaction {
  hash: string;
  wallet: string;
  amount: string;
  timestamp: number;
}

export const useContractFunders = () => {
  const [funders, setFunders] = useState<Funder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFunders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const fundersList: Funder[] = [];
      const uniqueFunders = new Set<string>();

      // Try to fetch up to 100 funders (adjust if needed)
      for (let i = 0; i < 100; i++) {
        try {
          const funderAddress = await getFunderByIndex(i);
          
          // If we get a valid address and haven't seen it before
          if (funderAddress && !uniqueFunders.has(funderAddress.toLowerCase())) {
            uniqueFunders.add(funderAddress.toLowerCase());
            
            // Get the amount funded by this address
            const amountFunded = await getAddressFunded(funderAddress);
            
            // Only add if they've actually funded
            if (amountFunded > BigInt(0)) {
              fundersList.push({
                wallet: funderAddress,
                total: parseFloat(formatEther(amountFunded)),
                timeStamp: Date.now() - (i * 1000 * 60 * 60), // Mock timestamp
              });
            }
          }
        } catch {
          // If we get an error, we've likely reached the end of the funders array
          break;
        }
      }

      setFunders(fundersList);
    } catch (err) {
      console.error('Error fetching funders:', err);
      const error = err as Error;
      setError(error.message || 'Failed to fetch funders');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFunders();
  }, [fetchFunders]);

  return {
    funders,
    loading,
    error,
    refresh: fetchFunders,
  };
};
