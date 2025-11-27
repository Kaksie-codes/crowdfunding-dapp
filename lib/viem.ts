import { createPublicClient, createWalletClient, http } from 'viem';
import { sepolia } from 'viem/chains';


const publicClient = createPublicClient({ 
  chain: sepolia,
  transport: http()
});


const walletClient = createWalletClient({ 
  chain: sepolia,
  transport: http()
});