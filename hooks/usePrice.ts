// hooks/usePrice.ts
'use client';

import { useEffect, useState, useCallback } from 'react';
import { getPrice } from '@/lib/contract';

export const usePrice = (pollInterval = 10_000) => {
  const [price, setPrice] = useState<bigint | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const fetchPrice = useCallback(async () => {
    try {
      setLoading(true);
      const p = await getPrice(); // returns bigint scaled by 1e18
      setPrice(p as bigint);
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrice();
    const id = setInterval(fetchPrice, pollInterval);
    return () => clearInterval(id);
  }, [fetchPrice, pollInterval]);

  /**
   * getPriceInEth: converts a USD amount (like 5) to ETH string
   * price (bigint) is USD price scaled with 18 decimals (i.e., 1 ETH == price / 1e18 USD)
   * So: 1 USD in ETH = (1e18) / price ; amount USD -> amount * 1e18 / price
   */
  const getPriceInEth = (usdAmount: number) => {
    if (!price) return null;
    // compute (usdAmount * 1e18) / price  -> result in ETH (as decimal string)
    const usdScaled = BigInt(Math.floor(usdAmount * 1e6)) * BigInt(10 ** 12); // usd*1e18 but avoid decimals: usdAmount * 1e6 then *1e12
    // usdScaled = usdAmount * 1e18 exactly
    // Now compute usdScaled / price (result is ETH in 1 scale)
    const ethInWei = (usdScaled * BigInt(1)) / price; // still bigint
    // Convert ethInWei (which is actually amount in "ETH" units scaled 1?) To be safe: we'll just produce a decimal with 18 decimals
    // We'll output string with up to 18 decimals:
    const whole = ethInWei / BigInt(1e18);
    const frac = ethInWei % BigInt(1e18);
    const fracStr = frac.toString().padStart(18, '0').replace(/0+$/, ''); // trim trailing zeros
    return `${whole.toString()}${fracStr ? '.' + fracStr : ''}`;
  };

  return { price, loading, error, getPriceInEth, refetch: fetchPrice };
};
