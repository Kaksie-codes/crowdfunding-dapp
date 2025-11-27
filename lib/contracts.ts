import { contractABI } from "./contractABI";
import { CONTRACT_ADDRESS } from "./contractaddress";
import { publicClient } from "./viem";


export const getEthPriceWei = async () => {
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

export const getOwner = async() => {
    const ownerAddress = await publicClient.readContract({
        address: CONTRACT_ADDRESS,
        abi: contractABI,
        functionName: "owner",
    });

    return ownerAddress;
}

