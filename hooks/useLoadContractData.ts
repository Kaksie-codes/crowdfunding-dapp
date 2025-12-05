import { useWalletContext } from "@/context/WalletProvider";
import { getContractBalance, getETHPrice, getMinDepositUSD, getNumberOfFunders, getWalletBalance } from "@/lib/contract";
import { useCallback, useEffect, useState } from "react";

export const useLoadContractData = () => {
    const {walletAddress} = useWalletContext();
    const [ethPrice, setEthPrice] = useState<string>('');
    const [numOfBackers, setNumOfBackers] = useState<number>(0);
    const [totalFundsRaised, setTotalFundsRaised] = useState<string>('');
    const [walletBalance, setWalletBalance] = useState<string>('');
    const [minDepositUSD, setMinDepositUSD] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const getContractData = useCallback(async() => {
            if(!walletAddress) return;
            try {
                setIsLoading(true);
                const [_ethPrice, _numOfBackers, _contractBalance, _walletBalance, _minDepositUSD ] = await Promise.all([
                    getETHPrice(),
                    getNumberOfFunders(),
                    getContractBalance(),
                    getWalletBalance(walletAddress),
                    getMinDepositUSD(),
                ])
                setEthPrice(_ethPrice);
                setNumOfBackers(_numOfBackers);
                setTotalFundsRaised(_contractBalance);
                setWalletBalance(_walletBalance);
                setMinDepositUSD(_minDepositUSD);
            } catch (error) {
                console.log('Error loading contract data:', error);
            }finally{
                setIsLoading(false);
            }       
        }, [walletAddress])

    useEffect(() => {        
        getContractData()
    }, [getContractData])

    return {
        ethPrice,
        numOfBackers,
        totalFundsRaised,
        walletBalance,
        minDepositUSD,
        isLoading,
        refresh: getContractData
    }

}