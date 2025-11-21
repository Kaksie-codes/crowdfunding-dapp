"use client";

interface BalanceTableProps {
  rows: {
    wallet: string;
    total: number;
  }[];
}

const BalanceTable = ({ rows }: BalanceTableProps) => {
  return (
    <table className="w-full mt-6 bg-card border border-border rounded-xl overflow-hidden">
      <thead className="bg-border/30">
        <tr>
          <th className="p-3 text-left text-sm">#</th>
          <th className="p-3 text-left text-sm">Wallet</th>
          <th className="p-3 text-left text-sm">Total Contributed</th>
        </tr>
      </thead>

      <tbody>
        {rows.map((w, index) => (
          <tr key={w.wallet} className="border-t border-border/40">
            <td className="p-3 text-gray font-mono">{index + 1}</td>
            <td className="p-3 break-all">{w.wallet}</td>
            <td className="p-3">{w.total} ETH</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default BalanceTable;
