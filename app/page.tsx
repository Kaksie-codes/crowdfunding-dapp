'use client';
import ControlInterface from "@/components/ControlInterface";
import DisplayCard from "@/components/DisplayCard";
import { useLoadContractData } from "@/hooks/useLoadContractData";


export default function Home() {
  const { minUSD, contractBalance, ethPrice, userBalance, loading, totalFunders, refresh } = useLoadContractData();
  console.log({minUSD, contractBalance, ethPrice, userBalance, totalFunders});
  return (
    <div className="text-white">
      <h1 className="text-xl">Interact with your smart contract directly from the browser</h1>
      <div className="grid grid-cols-2 mt-4 gap-6">
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <DisplayCard 
              title="Total Funds Raised" 
              description={`${contractBalance} ETH`} 
              descColor="text-primary"
              loading={loading}
            />
          </div>
          <DisplayCard 
            title="Number of Backers" 
            description={`${totalFunders} funder${totalFunders! > 1 ? 's' : ''}`}
             descColor="text-primary" 
          />
          <DisplayCard 
            title="Current ETH Price" 
            description={`${ethPrice?.toFixed(3)} USD`} 
            loading={loading}
            descColor="text-primary"
          />
          <DisplayCard 
            title="Your Wallet Balance" 
            description={`${userBalance} ETH`} 
            isSpanTwo
            descColor="text-green"
            loading={loading}
          />
          <DisplayCard 
            title="Min Deposit (USD)" 
            description={`${minUSD} USD`}
            loading={loading}
             descColor="text-yellow"
          />
          <DisplayCard 
            title="Min Deposit (ETH)" 
            description={`${(minUSD!/ethPrice!).toFixed(8)} ETH`}
             descColor="text-red"
             loading={loading}
          />
        </div>
        <ControlInterface />
      </div>
    </div>
  );
}
