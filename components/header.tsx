'use client';
import { useWallet } from '@/context/WalletProvider';
import Button from './Button'
import ConnectionStatus from './ConnectionStatus'
import { getWalletClient } from '@/lib/viem';
import { getContractBalance, getEthPriceWei } from '@/lib/contracts';
import { useEffect } from 'react';

const Header = () => {
  const { walletAddress, isConnected, setWalletAddress, setIsConnected } = useWallet();

  const loadData = async () => {
    const price = await getEthPriceWei();
    const balance = await getContractBalance();

    console.log("ETH Price:", price);
    console.log("Balance:", balance);
  };

  useEffect(() => {
    loadData();
  }, [])

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
