'use client';

import Button from './Button'
import ConnectionStatus from './ConnectionStatus'
import { useWalletContext } from '@/context/WalletProvider';

const ControlInterface = () => {
  const { walletAddress, isConnected } = useWalletContext();
  return (
    <div className='border border-border flex flex-col gap-6 rounded-md bg-card p-4'>
      <div className='flex flex-col'>
        <label htmlFor="ethAmount" className='text-lg font-bold text-gray'>ETH Amount</label>
        <input 
          type="number" 
          placeholder='0.000'
          id='ethAmount'
          className='border-4 border-border bg-[#424258] rounded-md p-2 outline-primary'
        />
      </div>
      <Button
        text='Buy Coffee'
        variant='primary'
        isFullWidth={true}
        size='lg'
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
