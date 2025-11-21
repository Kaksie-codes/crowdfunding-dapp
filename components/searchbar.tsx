"use client";

import { Search, X } from "lucide-react";

interface SearchBarProps {
  search: string;
  setSearch: (value: string) => void;
}

const SearchBar = ({ search, setSearch }: SearchBarProps) => {
  const clearSearch = () => {
    setSearch("");
  };

  return (
    <div className="flex items-center bg-card border border-border px-4 py-2 rounded-xl">
      <Search className="w-5 h-5 text-gray" />
      <input
        className="ml-2 bg-transparent outline-none w-full text-sm"
        placeholder="Search wallet or transaction hash..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {search && (
        <button
          onClick={clearSearch}
          className="ml-2 p-1 hover:bg-border/50 rounded-full transition-colors"
          title="Clear search"
        >
          <X className="w-4 h-4 text-gray hover:text-foreground" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
