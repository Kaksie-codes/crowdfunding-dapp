'use client';
import { useWallet } from '@/context/WalletProvider';
import Button from './Button'
import ConnectionStatus from './ConnectionStatus'
import { getWalletClient } from '@/lib/viem';

const Header = () => {
  const { walletAddress, isConnected, setWalletAddress, setIsConnected } = useWallet();
  console.log('Wallet address in Header:', walletAddress);
  console.log('isConnected in Header:', isConnected);

  const handleWalletConnect = async () => {
   const walletClient = await getWalletClient();
   const [address] = await walletClient.requestAddresses();
   setWalletAddress(address);
   setIsConnected(true);
   console.log('WalletAdress >>>>>:', address);
  }

  return (
    <header className=' bg-card border-b border-border w-full flex-1'>
      <div className="flex justify-end h-[60px] items-center pr-5">
          <div className='flex gap-[50px] items-center'>
            {isConnected && walletAddress && <ConnectionStatus  walletAddress={walletAddress}/>}              
            <Button 
              text={!isConnected ? "Connect Wallet" : "Wallet Connected"} 
              onClick={handleWalletConnect}
            />
          </div>
      </div>
    </header>
  )
}

export default Header
