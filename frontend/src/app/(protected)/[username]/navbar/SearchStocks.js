import { useRef, useState, useEffect, use } from "react";
import { useQuery } from "@tanstack/react-query";
import { useStock } from "@/contexts";

import { Search } from "lucide-react";
import { Input } from "@/components/ui";
import { handleSearchStocks } from "@/fetchers";

export default function SearchStocks() {
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isFocused, setIsFocused] = useState(false);

  const { setSelectedSymbol } = useStock();

  const { data } = useQuery({
    queryKey: ["StocksSearch", query],
    queryFn: async () => {
      try {
        return await handleSearchStocks(encodeURIComponent(query));
      } catch (err) {
        console.log(err);
      }
    },
    enabled: !!query.trim() && isFocused,
    retry: 1,
  });

  const stocks = data?.results?.quotes || [];

  useEffect(() => {
    function handleCloseDropdown(e) {
      if (e.type === "keydown" && e.key === "Escape") {
        setResults([]);
        setIsFocused(false);
      }

      if (
        e.type === "mousedown" &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setResults([]);
        setIsFocused(false);
      }
    }

    document.addEventListener("mousedown", handleCloseDropdown);
    document.addEventListener("keydown", handleCloseDropdown);

    return () => {
      document.removeEventListener("mousedown", handleCloseDropdown);
      document.removeEventListener("keydown", handleCloseDropdown);
    };
  }, []);

  useEffect(() => {
    if (!isFocused) return;

    const timeout = setTimeout(() => {
      if (!query.trim()) {
        setResults([]);
        return;
      }
      if (stocks) setResults(stocks);
    }, 300);

    return () => clearTimeout(timeout);
  }, [query, isFocused, stocks]);

  return (
    <div ref={dropdownRef} className="relative flex flex-col gap-2">
      <div className="flex gap-2 items-center">
        <Input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          className="w-50 h-10 text-sm bg-card border border-border rounded-xl focus-visible:ring-0"
          placeholder="Search"
        />
        <Search
          className="w-6 h-6 cursor-pointer hidden md:inline-block"
          onClick={() => {
            inputRef.current?.focus();
            setIsFocused(true);
          }}
        />
      </div>

      {results.length > 0 && (
        <div className="absolute top-12 right-8 sm:right-8 max-w-[70vw] w-72 max-h-80 overflow-auto bg-card border border-border rounded-xl shadow-lg z-10">
          {results
            .filter((stock) => stock && stock.symbol)
            .map((stock) => (
              <div
                key={stock.symbol}
                onClick={() => {
                  setSelectedSymbol(stock.symbol);
                  setQuery("");
                  setResults([]);
                }}
                className="flex items-center justify-between px-4 py-2.5 hover:bg-secondary/30 hover:shadow-md transition-all cursor-pointer"
              >
                <div>
                  <div className="text-sm font-semibold text-foreground">
                    {stock.symbol}
                  </div>
                  <div className="text-xs text-muted truncate max-w-[200px]">
                    {stock.shortname || stock.longname}
                  </div>
                </div>

                {stock.exchange && (
                  <div className="text-xs text-muted">{stock.exchange}</div>
                )}
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
