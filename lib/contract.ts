// lib/contract.ts
import { publicClient, createWalletClientForWindowEthereum } from './viem';
import type { Address } from 'viem';
import { parseEther } from 'viem';
import type { WalletClient } from 'viem';
import { getContract } from 'viem';
import ABI from './fundABi.json';
import { sepolia } from 'viem/chains';

// Your deployed contract address
export const CONTRACT_ADDRESS = '0x6248d029178E659639F30e43Ae98b2499EFbDC9C' as Address;

/**
 * getContractPublic - contract wrapper bound to the publicClient for read-only calls
 */
export const getContractPublic = () => {
  return getContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    client: publicClient,
  });
};

/**
 * getWalletClientAndContract - creates wallet client from injected provider and returns both
 * (call only after wallet is connected)
 */
export const getWalletClientAndContract = async (): Promise<{ walletClient: WalletClient; contract: ReturnType<typeof getContract> }> => {
  const walletClient = createWalletClientForWindowEthereum();
  const contract = getContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    client: { public: publicClient, wallet: walletClient },
  });
  return { walletClient, contract };
};

/* -------------------------
   Read helpers (using publicClient)
   ------------------------- */

export const getPrice = async (): Promise<bigint> => {
  // returns price (uint256) as bigint (18-decimal scaled, because contract returns scaled price)
  const contract = getContractPublic();
  const result = await contract.read.getPrice();
  return result as bigint;
};

export const getMinimumDollarWei = async (): Promise<bigint> => {
  const contract = getContractPublic();
  const result = await contract.read.mimimumDollarAmount();
  return result as bigint;
};

export const getOwner = async (): Promise<string> => {
  const contract = getContractPublic();
  return (await contract.read.owner()) as string;
};

export const getAddressFunded = async (addr: string): Promise<bigint> => {
  const contract = getContractPublic();
  return (await contract.read.addressToAmountFunded([addr])) as bigint;
};

export const getFunderByIndex = async (index: number): Promise<string> => {
  const contract = getContractPublic();
  return (await contract.read.funders([BigInt(index)])) as string;
};

// We can get contract balance via publicClient
export const getContractBalance = async (): Promise<bigint> => {
  return await publicClient.getBalance({ address: CONTRACT_ADDRESS });
};

/* -------------------------
   Write helpers (using walletClient)
   ------------------------- */

/**
 * fundContract - calls payable fund() with specified ETH amount (in string like "0.01")
 */
export const fundContract = async (valueEth: string) => {
  const { walletClient } = await getWalletClientAndContract();
  const [account] = await walletClient.getAddresses();

  // value in wei
  const value = parseEther(valueEth);

  // write call
  const tx = await walletClient.writeContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'fund',
    args: [],
    value,
    account,
    chain: sepolia,
  });

  return tx; // returns transaction hash or request result
};

/**
 * withdrawContract - owner-only withdraw
 */
export const withdrawContract = async () => {
  const { walletClient } = await getWalletClientAndContract();
  const [account] = await walletClient.getAddresses();

  const tx = await walletClient.writeContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'withdraw',
    args: [],
    account,
    chain: sepolia,
  });

  return tx;
};
