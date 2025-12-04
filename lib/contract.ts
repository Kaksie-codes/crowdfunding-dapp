import { contractABI } from "./contractABI"
import {CONTRACT_ADDRESS} from "./contractaddress"
import { publicClient } from "./viem"
import {formatEther} from 'viem'


export const getETHPrice = async() => {
    const res = await publicClient.readContract({
        address: CONTRACT_ADDRESS,
        abi: contractABI,
        functionName: 'getPrice',
    })

    // const ethPrice = (Number(res))/1e18;
    const ethPrice  = formatEther(res as bigint);
    return ethPrice;
}