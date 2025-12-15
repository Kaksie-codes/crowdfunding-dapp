'use client';

import { getWalletClient } from '@/lib/viem';
import Button from './Button'
import ConnectionStatus from './ConnectionStatus'
import { useWalletContext } from '@/context/WalletProvider'
import { useEffect, useState } from 'react';
import { getETHPrice, getNumberOfFunders } from '@/lib/contract';
import { Menu } from 'lucide-react';

const Header = ({ onToggleSidebar }: { onToggleSidebar: () => void }) => {
  const { walletAddress, isConnected, setWalletAddress, setIsConnected } = useWalletContext();
  const [ethPrice, setEthPrice] = useState<number | null>(null); 
  const [noOfFunders, setNoOfFunders] = useState<number | null>(null); 

  useEffect(() => {
     const loadETHPrice = async () => {
      try {
        const price = await getETHPrice();
        setEthPrice(Number(price));
      } catch (error) {
        console.error("Error fetching ETH price:", error);
      }
    }
    loadETHPrice();
  }, [])

  useEffect(() => {
    const loadNumberOfFunders = async () => {
      try {
        const numFunders = await getNumberOfFunders();  
        setNoOfFunders(numFunders);
      } catch (error) {
        console.error("Error fetching number of funders:", error);
      }
    }
    loadNumberOfFunders();
  }, [])

  useEffect(() => {
    console.log({ethPrice, noOfFunders});
  }, [ethPrice, noOfFunders])

  const handleClick = async() => {
    const walletClient = getWalletClient();
    const [address] = await walletClient.requestAddresses();
    setWalletAddress(address);
    setIsConnected(true); 
  }


  
 
  return (
    <header className=' bg-card border-b border-border w-full flex-1'>
      <div className="flex justify-between h-[60px] items-center px-5">
        <button onClick={onToggleSidebar} className="md:hidden p-2 hover:bg-accent rounded">
          <Menu size={24} />
        </button>
          <div className='flex gap-[50px] items-center ml-auto'>
              {isConnected && walletAddress && <ConnectionStatus walletAddress={walletAddress} />}
              <Button 
                text={isConnected ? "Wallet Connected" : "Connect Wallet"} 
                onClick={handleClick}
              />
          </div>
      </div>
    </header>
  )
}

export default Header
