'use client';
import ControlInterface from "@/components/ControlInterface";
import DisplayCard from "@/components/DisplayCard";
import { useContractData } from "@/context/ContractDataProvider";
import { useWalletContext } from "@/context/WalletProvider";


export default function Home() {
  const { isConnected } = useWalletContext();
  const { isLoading, ethPrice, numOfBackers, totalFundsRaised, walletBalance, minDepositUSD } = useContractData();

  return (
    <div className="text-white">
      <h1 className="text-xl">Interact with your smart contract directly from the browser</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 mt-4 gap-6">
        <div className="flex flex-col gap-3 lg:grid lg:grid-cols-2 lg:gap-3">
          <div className="col-span-2">
            <DisplayCard 
              title="Total Funds Raised" 
              description={`${Number(totalFundsRaised).toFixed(4)} ETH`}
              descColor="text-primary"
              loading={isLoading}
            />
          </div>
          <DisplayCard 
            title="Number of Backers" 
            description={`${numOfBackers}`}
            descColor="text-primary" 
            loading={isLoading}
          />
          <DisplayCard 
            title="Current ETH Price" 
            description={`${Number(ethPrice).toFixed(2)} USD`} 
            descColor="text-primary"
            loading={isLoading}
          />
          {isConnected && (
            <DisplayCard 
              title="Your Wallet Balance" 
              description={`${Number(walletBalance).toFixed(4)} ETH`}
              isSpanTwo
               descColor="text-green"
              loading={isLoading}
            />
          )}
          <DisplayCard 
            title="Min Deposit (USD)" 
            description={`${Number(minDepositUSD).toFixed(2)} USD`}
             descColor="text-yellow"
          />
          <DisplayCard 
            title="Min Deposit (ETH)" 
            description={`${(Number(minDepositUSD)/Number(ethPrice)).toFixed(5)} ETH`}
             descColor="text-red"
             
          />
        </div>
        {isConnected && <ControlInterface />}
      </div>
    </div>
  );
}
