"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const Tabs = ({ onChange }: { onChange: (index: number) => void }) => {
  const [active, setActive] = useState(0);

  const tabs = ["Transactions", "Balances"];

  return (
    <div className="relative flex gap-1 mt-4 p-1 bg-border/20 rounded-lg w-fit">
      <motion.div
        className="absolute top-1 bottom-1 bg-primary rounded-md shadow-sm"
        initial={false}
        animate={{
          left: active === 0 ? 4 : "calc(50% + 2px)",
          width: active === 0 ? "calc(50% - 6px)" : "calc(50% - 6px)",
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
        }}
      />
      {tabs.map((tab, i) => (
        <button
          key={i}
          onClick={() => {
            setActive(i);
            onChange(i);
          }}
          className={`relative z-10 px-6 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
            active === i
              ? "text-white"
              : "text-gray hover:text-foreground"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default Tabs;
