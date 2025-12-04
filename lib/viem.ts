import { createPublicClient, createWalletClient, custom, http } from 'viem';
import { sepolia } from 'viem/chains';
import type {EIP1193Provider} from 'viem';
import toast from 'react-hot-toast';

declare global {
  interface Window {
    ethereum?: EIP1193Provider;
  }
}

export const publicClient = createPublicClient({ 
  chain: sepolia,
  transport: http("https://ethereum-sepolia-rpc.publicnode.com")
})

export const getWalletClient = () => {
  if(!window.ethereum) {    
    toast.error("No injected ethereum provider found");
    throw new Error("No injected ethereum provider found");
  }
  const walletClient = createWalletClient({
    chain: sepolia,
    transport: custom(window.ethereum!)
  })

  return walletClient;
}
 