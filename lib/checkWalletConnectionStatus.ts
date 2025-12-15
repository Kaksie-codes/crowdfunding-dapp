import type { Address } from "viem";
import { getWalletClient } from "./viem";

export const checkWalletConnectionStatus = async (): Promise<Address | undefined> => {
    const walletClient = getWalletClient();
    const addresses = await walletClient.getAddresses();
    return addresses.length > 0 ? addresses[0] : undefined;
}