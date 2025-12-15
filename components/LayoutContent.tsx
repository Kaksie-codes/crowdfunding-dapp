'use client';
import { useState } from "react";
import Header from "./header";
import Sidebar from "./Sidebar";
import { useWalletContext } from "@/context/WalletProvider";

export function LayoutContent({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { walletAddress } = useWalletContext();

  return (
    <>
      <div className="flex">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} walletAddress={walletAddress} />
        <section className="flex-1">
          <Header onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
          <div className="p-4">
            {children}
          </div>
        </section>
      </div>
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </>
  );
}
