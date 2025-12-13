import { sepolia } from "viem/chains"
import { contractABI } from "./contractABI"
import {CONTRACT_ADDRESS} from "./contractAddress"
import { getWalletClient, publicClient } from "./viem"
import {Address, formatEther, parseEther} from 'viem'


// Reads all backers from the contract's funders array
// and their contribution amounts from the addressToAmountFunded mapping
export const getBackers = async () => {
    // Step 1: Get the total number of funders from the contract
    const count = await publicClient.readContract({
        address: CONTRACT_ADDRESS,
        abi: contractABI,
        functionName: 'getFundersCount',
    }) as bigint;

    const backers: { wallet: string; amount: string }[] = [];

    // Step 2: Loop through each index in the funders array
    for (let i = 0; i < Number(count); i++) {
        // Step 3: Get the funder's wallet address at index i
        const wallet = await publicClient.readContract({
            address: CONTRACT_ADDRESS,
            abi: contractABI,
            functionName: 'funders',
            args: [BigInt(i)],
        }) as string;

        // Step 4: Get the amount this wallet has contributed
        // from the addressToAmountFunded mapping
        const amountWei = await publicClient.readContract({
            address: CONTRACT_ADDRESS,
            abi: contractABI,
            functionName: 'addressToAmountFunded',
            args: [wallet],
        }) as bigint;

        // Step 5: Convert wei to ETH and add to backers array
        backers.push({
            wallet,
            amount: formatEther(amountWei),
        });
    }

    // Step 6: Sort backers by amount (highest contributor first)
    backers.sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount));

    return backers;
}

// Returns paginated list of backers
// page: current page number (1-indexed)
// pageSize: how many backers per page
export const getPaginatedBackers = async (page: number, pageSize: number) => {
    // Fetch all backers from the contract
    const all = await getBackers();
    // Calculate the starting index for this page
    const start = (page - 1) * pageSize;
    return {
        // Return only the backers for this page
        data: all.slice(start, start + pageSize),
        // Return total count for pagination controls
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