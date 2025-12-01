'use client';
import { useWallet } from '@/context/WalletProvider';
import Button from './Button'
import ConnectionStatus from './ConnectionStatus'
import { getWalletClient } from '@/lib/viem';
import { getContractBalance, getEthPrice, getMinimimUSDDeposit } from '@/lib/contracts';
import { useEffect } from 'react';

const Header = () => {
  const { walletAddress, isConnected, setWalletAddress, setIsConnected } = useWallet();

  const loadData = async () => {
    const price = await getEthPrice();
    const balance = await getContractBalance();
    const minUSDDeposit = await getMinimimUSDDeposit();

    console.log("ETH Price:", price);
    console.log("Balance:", balance);
    console.log("Minimum USD Deposit:", minUSDDeposit);
    console.log('min eth:', minUSDDeposit / price);
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
