'use client';

import Button from './Button';
import ConnectionStatus from './ConnectionStatus';
import { useWallet } from '@/context/WalletProvider';
import toast from 'react-hot-toast';

const Header = () => {
  const { address, isConnected, connect, disconnect } = useWallet();

  const handleWalletAction = async () => {
    if (isConnected) {
      disconnect();
      toast.success('Wallet disconnected');
    } else {
      try {
        await connect();
        toast.success('Wallet connected successfully!');
      } catch (error) {
        toast.error('Failed to connect wallet');
      }
    }
  };

  return (
    <header className='bg-card border-b border-border w-full flex-1'>
      <div className="flex justify-end h-[60px] items-center pr-5">
        <div className='flex gap-[50px] items-center'>
          {isConnected && address && (
            <ConnectionStatus walletAddress={address} />
          )}
          <Button 
            text={isConnected ? "Disconnect" : "Connect Wallet"} 
            onClick={handleWalletAction}
            variant={isConnected ? "secondary" : "primary"}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
