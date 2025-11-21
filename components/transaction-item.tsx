"use client";

import { Copy } from "lucide-react";

interface TransactionItemProps {
  item: {
    hash: string;
    wallet: string;
    timestamp: number;
  };
  copy: (value: string) => void;
  copied: string | null;
}

const TransactionItem = ({ item, copy, copied }: TransactionItemProps) => {
  return (
    <div className="bg-card p-4 rounded-xl border border-border flex flex-col gap-2">
      <div className="flex justify-between">
        <p className="text-sm text-gray">Hash:</p>
        <button onClick={() => copy(item.hash)}>
          <Copy className="w-4 h-4 text-primary" />
        </button>
      </div>
      <p className="break-all">{item.hash}</p>

      <div className="flex justify-between mt-3">
        <p className="text-sm text-gray">Wallet:</p>
        <button onClick={() => copy(item.wallet)}>
          <Copy className="w-4 h-4 text-primary" />
        </button>
      </div>
      <p className="break-all">{item.wallet}</p>

      <p className="text-sm text-gray mt-2">
        {new Date(item.timestamp).toLocaleString()}
      </p>
    </div>
  );
};

export default TransactionItem;
