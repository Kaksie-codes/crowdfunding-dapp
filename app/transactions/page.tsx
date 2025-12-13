"use client";

import Pagination from "@/components/Pagination";
import SearchBar from "@/components/searchbar";
import { useCopy } from "@/hooks/useCopy";
import { usePagination } from "@/hooks/usePagination";
import { getPaginatedBackers } from "@/lib/contract";
import { exportCSV } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Copy, Check } from "lucide-react";

const BackersPage = () => {
  const [search, setSearch] = useState("");
  const { copiedValue, copyToClipboard } = useCopy();

  // State for backers and loading
  const [backers, setBackers] = useState<{ wallet: string; amount: string }[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const pageSize = 21;
  const { currentPage, setCurrentPage } = usePagination(backers, pageSize);

  // Fetch backers from contract when page or search changes
  useEffect(() => {
    const fetchBackers = async () => {
      setIsLoading(true);
      // Get paginated backers from contract
      const { data, total } = await getPaginatedBackers(currentPage, pageSize);
      // Filter by wallet address search
      const filtered = data.filter((item) =>
        item.wallet.toLowerCase().includes(search.toLowerCase())
      );
      setBackers(filtered);
      setTotalPages(Math.ceil(total / pageSize));
      setIsLoading(false);
    };
    fetchBackers();
  }, [currentPage, search]);

  // Reset pagination when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, setCurrentPage]);

  // Copy button component
  const CopyButton = ({ value }: { value: string }) => (
    <button
      onClick={() => copyToClipboard(value)}
      className="p-1 hover:bg-border/50 rounded transition-colors"
      title="Copy to clipboard"
    >
      {copiedValue === value ? (
        <Check className="w-4 h-4 text-green-500" />
      ) : (
        <Copy className="w-4 h-4 text-primary" />
      )}
    </button>
  );

  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-4">Backers &amp; Contributions</h1>

      <SearchBar search={search} setSearch={setSearch} />

      {/* Only show Download CSV if there are backers */}
      {backers.length > 0 && (
        <button
          onClick={() => exportCSV(backers)}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-lg"
        >
          Download CSV
        </button>
      )}

      {/* Backers table with loading state */}
      {isLoading ? (
        <div className="text-center py-8 text-lg animate-pulse">Loading backers...</div>
      ) : backers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <svg width="64" height="64" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-gray-400 mb-4">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-4a4 4 0 11-8 0 4 4 0 018 0zm6 4a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <h2 className="text-xl font-semibold text-gray-400 mb-2">No backers found</h2>
          <p className="text-gray-500">There are currently no backers to display.</p>
        </div>
      ) : (
        <div className="mt-6 bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-border/30">
              <tr>
                <th className="p-3 text-left text-sm">#</th>
                <th className="p-3 text-left text-sm">Wallet Address</th>
                <th className="p-3 text-left text-sm">Amount Contributed</th>
              </tr>
            </thead>
            <tbody>
              {backers.map((backer, index) => (
                <tr key={backer.wallet} className="border-t border-border/40 hover:bg-border/10 transition-colors">
                  <td className="p-3 text-gray font-mono">{(currentPage - 1) * pageSize + index + 1}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <span className="break-all font-mono text-sm">
                        {backer.wallet.slice(0, 10)}...{backer.wallet.slice(-8)}
                      </span>
                      <CopyButton value={backer.wallet} />
                    </div>
                  </td>
                  <td className="p-3 font-mono">{backer.amount} ETH</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        setPage={setCurrentPage}
      />
    </div>
  );
};

export default BackersPage;
