import { contractABI } from "./contractABI"

import { publicClient } from "./viem"


export const getETHPrice = async() => {
    const res = await publicClient.readContract({
        address: CONTRACT_ADDRESS,
        abi: contractABI,
        functionName: 'getPrice',
    })
    return res;
}