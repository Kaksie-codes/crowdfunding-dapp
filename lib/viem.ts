// lib/viem.ts
import {
  createPublicClient,
  http,
  createWalletClient,
  custom,
  type Transport,
} from "viem";
import { sepolia } from "viem/chains";

// ⭐ EIP-1193 Provider Type (strict, no any)
export interface EIP1193Provider {
  request: <T = unknown>(args: {
    method: string;
    params?: readonly unknown[] | undefined;
  }) => Promise<T>;

  on?: (event: string, listener: (...args: unknown[]) => void) => void;
  removeListener?: (
    event: string,
    listener: (...args: unknown[]) => void
  ) => void;
}

// ⭐ Extend window typing so TS knows ethereum exists
declare global {
  interface Window {
    ethereum?: EIP1193Provider;
  }
}

// Public RPC client (read-only)
export const publicClient = createPublicClient({
  chain: sepolia,
  transport: http("https://ethereum-sepolia-rpc.publicnode.com", {
    timeout: 10_000, // 10 second timeout
  }),
});

// Wallet Client for MetaMask
export const createWalletClientForWindowEthereum = () => {
  if (typeof window === "undefined") {
    throw new Error("Must be run in the browser");
  }

  if (!window.ethereum) {
    throw new Error("Injected provider not found (MetaMask missing)");
  }

  // provider is now perfectly typed
  const provider: EIP1193Provider = window.ethereum;

  const transport: Transport = custom(provider);

  return createWalletClient({
    chain: sepolia,
    transport,
  });
};

// Helper to switch to Sepolia network
export const switchToSepolia = async () => {
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error('No Ethereum provider found');
  }

  const provider = window.ethereum;
  
  try {
    // Try to switch to Sepolia
    await provider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0xaa36a7' }], // Sepolia chain ID in hex
    });
  } catch (switchError) {
    const error = switchError as { code?: number };
    // This error code indicates that the chain has not been added to MetaMask
    if (error.code === 4902) {
      try {
        await provider.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: '0xaa36a7',
              chainName: 'Sepolia',
              nativeCurrency: {
                name: 'Sepolia ETH',
                symbol: 'ETH',
                decimals: 18,
              },
              rpcUrls: ['https://ethereum-sepolia-rpc.publicnode.com'],
              blockExplorerUrls: ['https://sepolia.etherscan.io'],
            },
          ],
        });
      } catch {
        throw new Error('Failed to add Sepolia network');
      }
    } else {
      throw error;
    }
  }
};
