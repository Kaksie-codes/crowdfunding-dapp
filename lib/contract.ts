// Reads all funder transactions from the contract
export const getTransactions = async () => {
    // Get total number of funders
    const count = await publicClient.readContract({
        address: CONTRACT_ADDRESS,
        abi: contractABI,
        functionName: 'getFundersCount',
    }) as number;

    const transactions = [];
    for (let i = 0; i < count; i++) {
        // Get funder address by index
        const wallet = await publicClient.readContract({
            address: CONTRACT_ADDRESS,
            abi: contractABI,
            functionName: 'funders',
            args: [i],
        }) as string;
        // Get amount funded by address
        const amount = await publicClient.readContract({
            address: CONTRACT_ADDRESS,
            abi: contractABI,
            functionName: 'addressToAmountFunded',
            args: [wallet],
        }) as bigint;
        // For demo, timestamp is not available in contract, so we use index as a placeholder
        transactions.push({
            hash: wallet, // No tx hash in contract, use wallet as unique key
            wallet,
            timestamp: Date.now() - (count - i) * 1000, // Fake timestamp
            amount: formatEther(amount),
        });
    }
    return transactions;
}

// Returns paginated transactions
export const getPaginatedTransactions = async (page: number, pageSize: number) => {
    const all = await getTransactions();
    const start = (page - 1) * pageSize;
    return {
        data: all.slice(start, start + pageSize),
        total: all.length,
    };
}
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