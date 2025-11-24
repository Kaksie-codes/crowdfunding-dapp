"use client";

import BalanceTable from "@/components/balance-table";
import Pagination from "@/components/Pagination";
import SearchBar from "@/components/searchbar";
import Tabs from "@/components/tabs";
import TransactionList from "@/components/transaction-list";
import { useCopy } from "@/hooks/useCopy";
import { usePagination } from "@/hooks/usePagination";
import { useContractFunders } from "@/hooks/useContractFunders";
import { transactions } from "@/lib/mockData";
import { exportCSV } from "@/lib/utils";
import { useState, useMemo, useEffect } from "react";

const TransactionsPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [search, setSearch] = useState("");
  const copyHook = useCopy();
  const { funders, loading: fundersLoading } = useContractFunders();

  // Convert funders to transactions format for display
  const realTransactions = useMemo(() => {
    return funders.map((funder) => ({
      hash: funder.wallet, // Use wallet address as unique identifier
      wallet: funder.wallet,
      amount: funder.total.toFixed(3),
      timestamp: funder.timeStamp,
    }));
  }, [funders]);

  // Use real transactions if available, otherwise fall back to mock data
  const displayData = realTransactions.length > 0 ? realTransactions : transactions;

  // filtering
  const filtered = useMemo(() => {
    return displayData.filter(
      (item) =>
        item.hash.toLowerCase().includes(search.toLowerCase()) ||
        item.wallet.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, displayData]);

  // pagination
  const { currentPage, setCurrentPage, totalPages, paginated } =
    usePagination(filtered, 24);

  // Reset pagination when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, setCurrentPage]);

  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-4">Transactions</h1>

      <SearchBar search={search} setSearch={setSearch} />
      <Tabs onChange={setActiveTab} />

      {fundersLoading && (
        <div className="mt-6 text-center text-gray">
          Loading contract data...
        </div>
      )}

      {/* TAB 1: TRANSACTIONS */}
      {activeTab === 0 && !fundersLoading && (
        <>
          <button
            onClick={() => exportCSV(filtered)}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Download CSV
          </button>

          <TransactionList data={paginated as { hash: string; wallet: string; timestamp: number; amount: string; }[]} copyHook={{
            copy: copyHook.copyToClipboard,
            copied: copyHook.copiedValue
          }} />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            setPage={setCurrentPage}
          />
        </>
      )}

      {/* TAB 2: BALANCES */}
      {activeTab === 1 && !fundersLoading && (
        <>
          <BalanceTable rows={funders} />
        </>
      )}
    </div>
  );
};

export default TransactionsPage;
