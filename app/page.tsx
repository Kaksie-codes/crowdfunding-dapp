'use client';

import ControlInterface from "@/components/ControlInterface";
import DisplayCard from "@/components/DisplayCard";
import { useContract } from "@/hooks/useContract";

export default function Home() {
  const {
    contractBalance,
    ethPrice,
    userBalance,
    minDepositUSD,
    minDepositETH,
    backersCount,
    loading,
  } = useContract();

  return (
    <div className="text-white">
      <h1 className="text-xl">Interact with your smart contract directly from the browser</h1>
      <div className="grid grid-cols-2 mt-4 gap-6">
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <DisplayCard 
              title="Total Funds Raised" 
              description={`${parseFloat(contractBalance).toFixed(4)} ETH`}
              descColor="text-primary"
              loading={loading}
            />
          </div>
          <DisplayCard 
            title="Number of Backers" 
            description={backersCount.toString()}
            descColor="text-primary"
            loading={loading}
          />
          <DisplayCard 
            title="Current ETH Price" 
            description={`$${ethPrice}`}
            descColor="text-primary"
            loading={loading}
          />
          <DisplayCard 
            title="Your Wallet Balance" 
            description={`${parseFloat(userBalance).toFixed(4)} ETH`}
            isSpanTwo
            descColor="text-green"
            loading={loading}
          />
          <DisplayCard 
            title="Min Deposit (USD)" 
            description={`$${minDepositUSD}`}
            descColor="text-yellow"
            loading={loading}
          />
          <DisplayCard 
            title="Min Deposit (ETH)" 
            description={`${minDepositETH} ETH`}
            descColor="text-red"
            loading={loading}
          />
        </div>
        <ControlInterface />
      </div>
    </div>
  );
}
