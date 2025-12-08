export const withdrawFunds = async (walletAddress: Address) => {
    const walletClient = getWalletClient();
    const txHash = await walletClient.writeContract({
        address: CONTRACT_ADDRESS,
        abi: contractABI,
        functionName: 'withdraw',
        account: walletAddress,
        chain: sepolia
    });
    return txHash;
}
import { sepolia } from "viem/chains"
import { contractABI } from "./contractABI"
import {CONTRACT_ADDRESS} from "./contractaddress"
import { getWalletClient, publicClient } from "./viem"
import {Address, formatEther, parseEther} from 'viem'


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

export const getNumberOfFunders = async() => {
    const res = await publicClient.readContract({
        address: CONTRACT_ADDRESS,
        abi: contractABI,
        functionName: 'getFundersCount', 
    })
    return Number(res);
}

export const fundContract = async( ethAmount: string, walletAddress: Address) => {
    const walletClient = getWalletClient();

    const txHash = await walletClient.writeContract({
        address: CONTRACT_ADDRESS,
        abi: contractABI,
        functionName: 'fund',
        // value: BigInt(ethAmount * 1e18), 
        value: parseEther(ethAmount),
        account: walletAddress,
        chain: sepolia
    })

    return txHash;
}

export const getContractBalance = async() => {
    const balance = await publicClient.getBalance({
        address: CONTRACT_ADDRESS,
    })
    return formatEther(balance);
}

export const getWalletBalance = async(walletAddress: Address) => {
    const balance = await publicClient.getBalance({
        address: walletAddress,
    })
    return formatEther(balance);
}

export const getMinDepositUSD = async() => {
    const res = await publicClient.readContract({
        address: CONTRACT_ADDRESS,
        abi: contractABI,
        functionName: 'mimimumDollarAmount',
    })
    return formatEther(res as bigint);
}

export const getOwner = async (): Promise<Address> => {
    const owner = await publicClient.readContract({
        address: CONTRACT_ADDRESS,
        abi: contractABI,
        functionName: 'owner',
    });
    return owner as Address;
}