import { createPublicClient, createWalletClient, custom, http } from 'viem';
import { sepolia } from 'viem/chains';
import type { EIP1193Provider } from 'viem';

declare global {
  interface Window {
    ethereum?: EIP1193Provider;
  }
}

// export const publicClient = createPublicClient({ 
//   chain: sepolia,
//   transport: http("https://ethereum-sepolia-rpc.publicnode.com")
// });

export const publicClient = createPublicClient({ 
  chain: sepolia,
  transport: custom(window.ethereum!)
});

export const getWalletClient = () => {
  if(typeof window === 'undefined' || !window.ethereum) {
    throw new Error('No injected Ethereum provider found');
  }

  return createWalletClient({ 
    chain: sepolia,
    transport: custom(window.ethereum!)
  })
}

