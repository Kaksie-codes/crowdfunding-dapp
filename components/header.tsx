'use client';
import { useWallet } from '@/context/WalletProvider';
import Button from './Button'
import ConnectionStatus from './ConnectionStatus'

const Header = () => {
  const { walletAddress, isConnected } = useWallet();
  console.log('Wallet address in Header:', walletAddress);
  console.log('isConnected in Header:', isConnected);
  return (
    <header className=' bg-card border-b border-border w-full flex-1'>
      <div className="flex justify-end h-[60px] items-center pr-5">
          <div className='flex gap-[50px] items-center'>
            {isConnected && walletAddress && <ConnectionStatus  walletAddress={walletAddress}/>}              
            <Button text="Connect Wallet" />
          </div>
      </div>
    </header>
  )
}

export default Header
