"use client";

import { Copy, Check } from "lucide-react";

interface TransactionListProps {
  data: {
    hash: string;
    wallet: string;
    timestamp: number;
    amount?: string;
  }[];
  copyHook: {
    copy: (value: string) => void;
    copied: string | null;
  };
}

const TransactionList = ({ data, copyHook }: TransactionListProps) => {
  const { copy, copied } = copyHook;

  const CopyButton = ({ value }: { value: string }) => (
    <button 
      onClick={() => copy(value)}
      className="p-1 hover:bg-border/50 rounded transition-colors"
      title="Copy to clipboard"
    >
      {copied === value ? (
        <Check className="w-4 h-4 text-green-500" />
      ) : (
        <Copy className="w-4 h-4 text-primary" />
      )}
    </button>
  );

  return (
    <div className="mt-6 bg-card border border-border rounded-xl overflow-hidden">
      <table className="w-full">
        <thead className="bg-border/30">
          <tr>
            <th className="p-3 text-left text-sm">#</th>
            <th className="p-3 text-left text-sm">Transaction Hash</th>
            <th className="p-3 text-left text-sm">Wallet Address</th>
            <th className="p-3 text-left text-sm">Amount</th>
            <th className="p-3 text-left text-sm">Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={item.hash} className="border-t border-border/40 hover:bg-border/10 transition-colors">
              <td className="p-3 text-gray font-mono">{index + 1}</td>
              <td className="p-3">
                <div className="flex items-center gap-2">
                  <span className="break-all font-mono text-sm">
                    {item.hash.slice(0, 10)}...{item.hash.slice(-8)}
                  </span>
                  <CopyButton value={item.hash} />
                </div>
              </td>
              <td className="p-3">
                <div className="flex items-center gap-2">
                  <span className="break-all font-mono text-sm">
                    {item.wallet.slice(0, 10)}...{item.wallet.slice(-8)}
                  </span>
                  <CopyButton value={item.wallet} />
                </div>
              </td>
              <td className="p-3 font-mono">{item.amount || '0.000'} ETH</td>
              <td className="p-3 text-sm text-gray">
                {new Date(item.timestamp).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionList;
