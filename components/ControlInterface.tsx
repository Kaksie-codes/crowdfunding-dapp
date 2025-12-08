'use client';

import { fundContract } from '@/lib/contract';
import Button from './Button'
import ConnectionStatus from './ConnectionStatus'
import { useWalletContext } from '@/context/WalletProvider';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { useContractData } from '@/context/ContractDataProvider';
import { publicClient } from '@/lib/viem';

const ControlInterface = () => {
  const { walletAddress, isConnected } = useWalletContext();
  const { refresh } = useContractData();
  const [ethAmount, setEthAmount] = useState<string>('');
  const [isFunding, setIsFunding] = useState<boolean>(false);


  useEffect(() => {
    console.log({ethAmount})
  }, [ethAmount])

  const handleFundContract = async () => {
    if(!ethAmount){
      toast.error('Please enter a valid ETH amount.');
      return;
    }
    if(!isConnected || !walletAddress){
      toast.error('Please connect your wallet first.');
      return;
    }
    try {
      setIsFunding(true);
      const txHash = await fundContract(ethAmount, walletAddress);
      console.log('Fund contract response:', txHash);
      // Wait for transaction confirmation
      await publicClient.waitForTransactionReceipt({ hash: txHash });
      // Wait for the next block to ensure RPC node is updated
      await publicClient.getBlock();
      await refresh();
      setEthAmount('');
      toast.success('Successfully funded the contract!');
    } catch (error) {
      console.log('Error funding contract:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to fund the contract. Please try again.');
    } finally {
      setIsFunding(false);
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
          value={ethAmount}
          onChange={(e) => setEthAmount(e.target.value)}
          className='border-4 border-border bg-[#424258] rounded-md p-2 outline-primary'
        />
      </div>
      <Button
        text='Buy Coffee'
        variant='primary'
        isFullWidth={true}
        size='lg'
        onClick={handleFundContract}
        isLoading={isFunding}
      />
      <Button
        text='Refresh Contract Balance'
        variant='secondary'
        isFullWidth={true}
        size='lg'
      />
      <Button
        text='Withdraw Funds'
        variant='danger'
        isFullWidth={true}
        size='lg'
      />
      {isConnected && walletAddress && <ConnectionStatus walletAddress={walletAddress} />}
    </div>
  )
}

export default ControlInterface
