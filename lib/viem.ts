// lib/viem.ts
import { createPublicClient, http, createWalletClient, custom, type Transport, fallback } from 'viem';
import { sepolia } from 'viem/chains';

// Public RPC (Sepolia). You can replace with your own RPC (Infura/Alchemy) if desired.
const SEPOLIA_RPC = 'https://rpc.sepolia.org'; // public RPC endpoint

export const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(SEPOLIA_RPC),
});

/**
 * createWalletClientForWindowEthereum
 * Creates a wallet client for the injected provider (MetaMask).
 * Call this after the user grants access (i.e., when window.ethereum is available).
 */
export const createWalletClientForWindowEthereum = () => {
  if (typeof window === 'undefined') throw new Error('createWalletClientForWindowEthereum must run in the browser');

  // @ts-ignore window.ethereum typed as any
  const provider = (window as any).ethereum;
  if (!provider) throw new Error('No injected provider found (MetaMask)');

  // 'custom' wraps the injected provider as a viem transport
  const transport: Transport = custom(provider);

  return createWalletClient({
    chain: sepolia,
    transport,
  });
};
