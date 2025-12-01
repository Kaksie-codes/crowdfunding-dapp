import { sepolia } from "viem/chains";
import { contractABI } from "./contractABI";
import { CONTRACT_ADDRESS } from "./contractaddress";
import { getWalletClient, publicClient } from "./viem";
import { Address, parseEther, formatEther } from 'viem';


export const getEthPrice = async () => {
    const ethPriceWei = await publicClient.readContract({
        address: CONTRACT_ADDRESS,
        abi: contractABI,
        functionName: "getPrice",
    })
    const ethPriceUSD = Number(ethPriceWei) / 1e18;  
    return  ethPriceUSD;
}

export const getContractBalance = async () => {
   const contractBalanceWei = await publicClient.getBalance({ 
        address: CONTRACT_ADDRESS 
    });

    const contractBalanceEth = Number(contractBalanceWei) / 1e18;
    return contractBalanceEth;
}

export const getUserBalance = async () => {
  const walletClient = await getWalletClient();
  const [address] = await walletClient.getAddresses();

  const balance = await publicClient.getBalance({ address });
  return Number(formatEther(balance));
};

export const getMinimimUSDDeposit = async () => {
    const minUSDWei = await publicClient.readContract({
        address: CONTRACT_ADDRESS,
        abi: contractABI,
        functionName: "mimimumDollarAmount",
    });

    const minUSD = Number(minUSDWei) / 1e18;
    return minUSD;
}

export const getTotalFunders = async () => {
  const count = await publicClient.readContract({
    address: CONTRACT_ADDRESS,
    abi: contractABI,
    functionName: "getFundersCount",
  });

  return Number(count);
};

export const getOwner = async(): Promise<string> => {
    const ownerAddress = await publicClient.readContract({
        address: CONTRACT_ADDRESS,
        abi: contractABI,
        functionName: "owner",
    });

    return ownerAddress as string;
}




export const fundContract = async(ethValue: string, senderAddress: Address) => {
    const walletClient = await getWalletClient();
    const value = parseEther(ethValue)

    const transaction = walletClient.writeContract({
        address: CONTRACT_ADDRESS,
        abi: contractABI,
        functionName: "fund",
        value: value,
        account: senderAddress, 
        chain: sepolia
    });

    return transaction;
}


export const withdrawFunds = async(senderAddress: Address) => {
    const walletClient = await getWalletClient();

    const transaction = walletClient.writeContract({
        address: CONTRACT_ADDRESS,
        abi: contractABI,
        functionName: "withdraw",
        account: senderAddress, 
        chain: sepolia
    });

    return transaction;
}

