'use client'

import Button from './Button'
import ConnectionStatus from './ConnectionStatus'
import { fundContract, getOwner, withdrawFunds } from '@/lib/contracts'
import { useWallet } from '@/context/WalletProvider'
import { useEffect, useState } from 'react';
import { useLoadContractData } from '@/hooks/useLoadContractData'


const ControlInterface = () => {
  const { walletAddress, isConnected } = useWallet();
  const [withdrawing, setWithdrawing] = useState(false);
  const [funding, setFunding] = useState(false);
  const [owner, setOwner] = useState<string | null>(null);
  const [ethValue, setEthValue] = useState<string>("");
  const { refresh } = useLoadContractData();
  

  useEffect(() => {
    const fetchOwner = async() => {
      const _owner = await getOwner();
      setOwner(_owner);
    }
    fetchOwner();
  }, [])

  const handleWithdraw = async () => {
    if (!walletAddress) return;
    setWithdrawing(true);
    try {
      await withdrawFunds(walletAddress);
      // Optionally show a toast or notification here
    } catch (err:unknown) {
      // toast.error("Withdrawal failed");
      console.error("Withdrawal failed:", err);
      // Optionally handle error (show toast)
    } finally {
      setWithdrawing(false);
    }
  };

  const handleFund = async () => {
    if (!walletAddress) return;
    setFunding(true);
    try {
      // await fundContract(ethValue, walletAddress);
      // Optionally show a toast or notification here
      await fundContract(ethValue, walletAddress);
    } catch (err:unknown) {
      // toast.error("Funding failed");
      console.error("Funding failed:", err);
      // Optionally handle error (show toast)
    } finally {
      setFunding(false);
    }
  }

  return (
    <div className='border border-border flex flex-col gap-6 rounded-md bg-card p-4'>
      <div className='flex flex-col'>
        <label htmlFor="ethAmount" className='text-lg font-bold text-gray'>ETH Amount</label>
        <input 
          type="number" 
          placeholder='0.000'
          id='ethAmount'
          value={ethValue}
          onChange={(e) => setEthValue(e.target.value)}
          className='border-4 border-border bg-[#424258] rounded-md p-2 outline-primary'
        />
      </div>
      <Button
        text='Buy Coffee'
        variant='primary'
        isFullWidth={true}
        size='lg'
        onClick={handleFund}
        isLoading={funding}
      />
      <Button
        text='Refresh Contract Balance'
        variant='secondary'
        isFullWidth={true}
        onClick={refresh}
        size='lg'
      />
      {walletAddress?.toLowerCase() === owner?.toLowerCase() && (
        <Button
          text={withdrawing ? 'Withdrawing...' : 'Withdraw Funds'}
          variant='danger'
          isFullWidth={true}
          size='lg'
          onClick={handleWithdraw}
          isLoading={withdrawing}
        />
      )}
      
      {isConnected && walletAddress && <ConnectionStatus walletAddress={walletAddress} />}
    </div>
  )
}

export default ControlInterface
