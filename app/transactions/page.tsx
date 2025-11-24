"use client";

import BalanceTable from "@/components/balance-table";
import Pagination from "@/components/Pagination";
import SearchBar from "@/components/searchbar";
import Tabs from "@/components/tabs";
import TransactionList from "@/components/transaction-list";
import { useCopy } from "@/hooks/useCopy";
import { usePagination } from "@/hooks/usePagination";
import { contributors, transactions } from "@/lib/mockData";
import { exportCSV } from "@/lib/utils";
import { useState, useMemo, useEffect } from "react";

const TransactionsPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [search, setSearch] = useState("");
  const {copiedValue, copyToClipboard} = useCopy();

  // filtering
  const filtered = useMemo(() => {
    return transactions.filter(
      (item) =>
        item.hash.toLowerCase().includes(search.toLowerCase()) ||
        item.wallet.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  // pagination
  const { currentPage, setCurrentPage, totalPages, paginated } =  usePagination(filtered, 21);

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
          <button
            onClick={() => exportCSV(filtered)}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg"
          >
            Download CSV
          </button>

          <TransactionList 
            data={paginated as { hash: string; wallet: string; timestamp: number; amount: string; }[]} 
            copyHook={{
              copy: copyToClipboard,
              copied: copiedValue
            }} 
          />
          <Pagination
            currentPage={currentPage}
            totalPages={600}
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
