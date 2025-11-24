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
  transport: http("https://rpc.sepolia.org"),
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
