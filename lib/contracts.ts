import { contractABI } from "./contractABI";
import { CONTRACT_ADDRESS } from "./contractaddress";
import { publicClient } from "./viem";

export const getPrice = async () => {
  return publicClient.readContract({
    address: CONTRACT_ADDRESS,
    abi: contractABI,
    functionName: "getPrice",
  });
};