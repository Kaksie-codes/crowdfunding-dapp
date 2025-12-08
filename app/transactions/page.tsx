"use client";

import BalanceTable from "@/components/balance-table";
import Pagination from "@/components/Pagination";
import SearchBar from "@/components/searchbar";
import Tabs from "@/components/tabs";
import TransactionList from "@/components/transaction-list";
import { useCopy } from "@/hooks/useCopy";
import { usePagination } from "@/hooks/usePagination";
import { contributors } from "@/lib/mockData";
import { getPaginatedTransactions } from "@/lib/contract";
import { exportCSV } from "@/lib/utils";
import { useState, useMemo, useEffect } from "react";

const TransactionsPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [search, setSearch] = useState("");
  const {copiedValue, copyToClipboard} = useCopy();

  // State for transactions and loading
  const [transactions, setTransactions] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const pageSize = 21;
  const { currentPage, setCurrentPage } = usePagination(transactions, pageSize);

  // Fetch transactions from contract when page or search changes
  useEffect(() => {
    const fetchTx = async () => {
      setIsLoading(true);
      // Get paginated transactions from contract
      const { data, total } = await getPaginatedTransactions(currentPage, pageSize);
      // Filter by search
      const filtered = data.filter(
        (item) =>
          item.hash.toLowerCase().includes(search.toLowerCase()) ||
          item.wallet.toLowerCase().includes(search.toLowerCase())
      );
      setTransactions(filtered);
      setTotalPages(Math.ceil(total / pageSize));
      setIsLoading(false);
    };
    fetchTx();
  }, [currentPage, search]);

  // Reset pagination when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, setCurrentPage]);

  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-4">Transactions</h1>

      <SearchBar search={search} setSearch={setSearch} />
      <Tabs onChange={setActiveTab} />

      {/* TAB 1: TRANSACTIONS */}
      {activeTab === 0 && (
        <>
          {/* Only show Download CSV if there are transactions */}
          {transactions.length > 0 && (
            <button
              onClick={() => exportCSV(transactions)}
              className="mt-4 px-4 py-2 bg-primary text-white rounded-lg"
            >
              Download CSV
            </button>
          )}

          {/* TransactionList displays loading state if isLoading is true */}
          {isLoading ? (
            <div className="text-center py-8 text-lg animate-pulse">Loading transactions...</div>
          ) : transactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <svg width="64" height="64" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-gray-400 mb-4">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6 1a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h2 className="text-xl font-semibold text-gray-400 mb-2">No transactions found</h2>
              <p className="text-gray-500">There are currently no transactions to display.</p>
            </div>
          ) : (
            <TransactionList 
              data={transactions as { hash: string; wallet: string; timestamp: number; amount: string; }[]} 
              copyHook={{
                copy: copyToClipboard,
                copied: copiedValue
              }} 
            />
          )}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            setPage={setCurrentPage}
          />
        </>
      )}

      {/* TAB 2: BALANCES */}
      {activeTab === 1 && (
        <>
          
          <BalanceTable rows={contributors} />
        </>
      )}
    </div>
  );
};

export default TransactionsPage;
