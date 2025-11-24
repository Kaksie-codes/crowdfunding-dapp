'use client';

import React, { useState } from 'react';
import Button from './Button';
import ConnectionStatus from './ConnectionStatus';
import { useWallet } from '@/context/WalletProvider';
import { useContract } from '@/hooks/useContract';
import toast from 'react-hot-toast';
import { switchToSepolia } from '@/lib/viem';

const ControlInterface = () => {
  const { address, isConnected, chainId } = useWallet();
  const { fund, withdraw, refresh, isOwner, minDepositETH } = useContract();
  
  const [ethAmount, setEthAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFund = async () => {
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }

    // Check if on Sepolia network (chain ID 11155111)
    if (chainId !== 11155111) {
      try {
        await toast.promise(
          switchToSepolia(),
          {
            loading: 'Switching to Sepolia network...',
            success: 'Network switched to Sepolia!',
            error: 'Failed to switch network. Please switch manually.',
          }
        );
        // Wait a bit for the network switch to complete
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch {
        toast.error('Please switch to Sepolia network in MetaMask');
        return;
      }
    }

    if (!ethAmount || parseFloat(ethAmount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    // Check minimum deposit
    if (parseFloat(ethAmount) < parseFloat(minDepositETH)) {
      toast.error(`Minimum deposit is ${minDepositETH} ETH ($5 USD equivalent)`);
      return;
    }

    try {
      setLoading(true);
      const txHash = await toast.promise(
        fund(ethAmount),
        {
          loading: 'Processing transaction...',
          success: 'Transaction successful!',
          error: 'Transaction failed',
        }
      );
      toast.success(`Hash: ${txHash.slice(0, 10)}...${txHash.slice(-8)}`, {
        duration: 6000,
      });
      setEthAmount('');
    } catch (err) {
      const error = err as Error;
      toast.error(error.message || 'Transaction failed');
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!isOwner) {
      toast.error('Only the contract owner can withdraw funds');
      return;
    }

    // Check if on Sepolia network
    if (chainId !== 11155111) {
      try {
        await toast.promise(
          switchToSepolia(),
          {
            loading: 'Switching to Sepolia network...',
            success: 'Network switched to Sepolia!',
            error: 'Failed to switch network. Please switch manually.',
          }
        );
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch {
        toast.error('Please switch to Sepolia network in MetaMask');
        return;
      }
    }

    try {
      setLoading(true);
      const txHash = await toast.promise(
        withdraw(),
        {
          loading: 'Processing withdrawal...',
          success: 'Withdrawal successful!',
          error: 'Withdrawal failed',
        }
      );
      toast.success(`Hash: ${txHash.slice(0, 10)}...${txHash.slice(-8)}`, {
        duration: 6000,
      });
    } catch (err) {
      const error = err as Error;
      toast.error(error.message || 'Withdrawal failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      await toast.promise(
        refresh(),
        {
          loading: 'Refreshing contract data...',
          success: 'Data refreshed successfully!',
          error: 'Failed to refresh data',
        }
      );
    } catch {
      toast.error('Failed to refresh data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='border border-border flex flex-col gap-6 rounded-md bg-card p-4'>
      {isConnected && chainId !== 11155111 && (
        <div className='bg-yellow-500/20 border border-yellow-500 rounded-md p-3 text-yellow-200 text-sm'>
          ⚠️ Wrong network! Please switch to Sepolia. The app will attempt to switch automatically when you transact.
        </div>
      )}
      
      <div className='flex flex-col'>
        <label htmlFor="ethAmount" className='text-lg font-bold text-gray'>
          ETH Amount {minDepositETH && `(Min: ${minDepositETH} ETH)`}
        </label>
        <input 
          type="number" 
          placeholder='0.000'
          id='ethAmount'
          value={ethAmount}
          onChange={(e) => setEthAmount(e.target.value)}
          disabled={loading || !isConnected}
          className='border-4 border-border bg-[#424258] rounded-md p-2 outline-primary disabled:opacity-50 disabled:cursor-not-allowed'
          step="0.001"
          min="0"
        />
      </div>

      <Button
        text={loading ? 'Processing...' : 'Fund Contract'}
        variant='primary'
        isFullWidth={true}
        size='lg'
        onClick={handleFund}
        disabled={loading || !isConnected}
      />

      <Button
        text={loading ? 'Refreshing...' : 'Refresh Contract Balance'}
        variant='secondary'
        isFullWidth={true}
        size='lg'
        onClick={handleRefresh}
        disabled={loading}
      />

      <Button
        text={loading ? 'Processing...' : 'Withdraw Funds (Owner Only)'}
        variant='danger'
        isFullWidth={true}
        size='lg'
        onClick={handleWithdraw}
        disabled={loading || !isConnected || !isOwner}
      />

      {address && <ConnectionStatus walletAddress={address} />}
    </div>
  );
};

export default ControlInterface;
