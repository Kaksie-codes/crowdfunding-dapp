import type { Address } from "viem";
import { getWalletClient } from "./viem";

export const getConnectedAddress = async (): Promise<Address | undefined> => {
  const walletClient = await getWalletClient();
  const [address] = await walletClient.getAddresses();
  return address;
};
