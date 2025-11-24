'use client';

import React, { useState } from 'react';
import Button from './Button';
import ConnectionStatus from './ConnectionStatus';
import { useWallet } from '@/context/WalletProvider';
import { useContract } from '@/hooks/useContract';

const ControlInterface = () => {
  const { address, isConnected } = useWallet();
  const { fund, withdraw, refresh, isOwner, minDepositETH } = useContract();
  
  const [ethAmount, setEthAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleFund = async () => {
    setError('');
    setSuccess('');
    
    if (!isConnected) {
      setError('Please connect your wallet first');
      return;
    }

    if (!ethAmount || parseFloat(ethAmount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    // Check minimum deposit
    if (parseFloat(ethAmount) < parseFloat(minDepositETH)) {
      setError(`Minimum deposit is ${minDepositETH} ETH ($5 USD equivalent)`);
      return;
    }

    try {
      setLoading(true);
      const txHash = await fund(ethAmount);
      setSuccess(`Transaction successful! Hash: ${txHash.slice(0, 10)}...`);
      setEthAmount('');
    } catch (err: any) {
      setError(err.message || 'Transaction failed');
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    setError('');
    setSuccess('');
    
    if (!isConnected) {
      setError('Please connect your wallet first');
      return;
    }

    if (!isOwner) {
      setError('Only the contract owner can withdraw funds');
      return;
    }

    try {
      setLoading(true);
      const txHash = await withdraw();
      setSuccess(`Withdrawal successful! Hash: ${txHash.slice(0, 10)}...`);
    } catch (err: any) {
      setError(err.message || 'Withdrawal failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await refresh();
      setSuccess('Contract data refreshed!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError('Failed to refresh data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='border border-border flex flex-col gap-6 rounded-md bg-card p-4'>
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

      {error && (
        <div className='bg-red-500/20 border border-red-500 rounded-md p-3 text-red-200 text-sm'>
          {error}
        </div>
      )}

      {success && (
        <div className='bg-green-500/20 border border-green-500 rounded-md p-3 text-green-200 text-sm'>
          {success}
        </div>
      )}

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
