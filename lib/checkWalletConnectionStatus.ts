import type { Address } from "viem";
import { getWalletClient } from "./viem";

export const checkWalletConnectionStatus = async (): Promise<Address | undefined> => {
    const walletClient = getWalletClient();
    const [address] = await walletClient.requestAddresses();
    return address;
}