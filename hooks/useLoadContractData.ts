import { getContractBalance, getEthPrice, getMinimimUSDDeposit, getTotalFunders, getUserBalance } from "@/lib/contracts";
import { useCallback, useEffect, useState } from "react";

export const useLoadContractData = () => {
    const [loading, setLoading] = useState(true);
    const [minUSD, setMinUSD] = useState<number | null>(null);
    const [contractBalance, setContractBalance] = useState<number | null>(null);
    const [ethPrice, setEthPrice] = useState<number | null>(null);
    const [userBalance, setUserBalance] = useState<number | null>(null);
    const [totalFunders, setTotalFunders] = useState<number | null>(null);

    const loadData = useCallback(async() => {
        const [minUSD, contractBalance, ethPrice, userBalance, totalFunders] = await Promise.all([
            getMinimimUSDDeposit(),
            getContractBalance(),
            getEthPrice(),
            getUserBalance(),
            getTotalFunders()
        ])
        setMinUSD(minUSD);
        setContractBalance(contractBalance);
        setEthPrice(ethPrice);
        setUserBalance(userBalance);
        setTotalFunders(totalFunders);
        setLoading(false);
    }, [])

    useEffect(() => {
        /* eslint-disable react-hooks/set-state-in-effect */
        loadData();
    }, [loadData]);


    return { minUSD, contractBalance, ethPrice, userBalance, totalFunders, loading, refresh: loadData };  
}


