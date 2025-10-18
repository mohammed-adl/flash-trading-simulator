"use client";

import React, { useState, useRef, useEffect } from "react";

import { useAsset } from "@/contexts";
import {
  Search as SearchIcon,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { calcUnrealizedPnLP } from "@/utils";

export default function WalletDropdown({ onSelect, username }) {
  const { assetsPrices, selectedSymbol, setSelectedSymbol } = useAsset();
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState("");
  const [selected, setSelected] = useState(null);
  const ref = useRef(null);
  const LIST_LIMIT = 4;

  useEffect(() => {
    function onDocClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const holdings = assetsPrices.map((s) => {
    const changeValue = calcUnrealizedPnLP(s.avgPrice, s.price);
    return {
      symbol: s.symbol,
      name: s.name,
      change: changeValue,
    };
  });

  const results = holdings
    .filter(
      (a) =>
        a.name.toLowerCase().includes(filter.toLowerCase()) ||
        a.symbol.toLowerCase().includes(filter.toLowerCase())
    )
    .slice(0, LIST_LIMIT);

  function handleSelect(a) {
    setSelected(a);
    setOpen(false);
    setFilter("");
    if (onSelect) onSelect(a);
    setSelectedSymbol(a.symbol);

    if (window.innerWidth < 768) {
      window.scrollTo({
        top: window.innerHeight * 0.88,
        behavior: "smooth",
      });
    }
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="text-sm text-foreground hover:text-foreground cursor-pointer"
      >
        <span className="text-md font-bold flex items-center gap-1">
          {username}&rsquo;s wallet
          <span className="relative top-[1px] text-muted">▼</span>
        </span>
      </button>

      {open && (
        <div className="absolute left-3 top-6 sm:top-4 sm:left-23 mt-2 w-65 bg-card border border-border rounded-xl shadow-lg z-50 overflow-hidden">
          <div className="p-2">
            <div className="flex items-center gap-2 px-2 py-2 rounded">
              <SearchIcon className="w-4 h-4 text-foreground" />
              <input
                autoFocus
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="Search holdings..."
                className="bg-transparent outline-none text-sm w-full"
              />
            </div>
          </div>

          <hr className="border-border" />

          <div className="px-3 py-2 text-sm font-medium text-primary">
            Recent Holdings
          </div>

          <ul className="divide-y divide-border">
            {results.length === 0 ? (
              <li className="p-3 text-sm text-foreground">No results</li>
            ) : (
              results.map((a) => (
                <li
                  key={a.symbol}
                  onClick={() => handleSelect(a)}
                  className="cursor-pointer hover:bg-accent px-3 py-2 flex justify-between items-center"
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{a.symbol}</span>
                    <span className="text-xs text-primary">{a.name}</span>
                  </div>
                  <span
                    className={`flex items-center font-medium ${
                      a.change >= 0 ? "text-up" : "text-down"
                    }`}
                  >
                    {a.change >= 0 ? (
                      <ArrowUpRight className="w-4 h-4 mr-1 opacity-50 text-up" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 mr-1 opacity-50 text-down" />
                    )}
                    {a.change.toFixed(2)}%
                  </span>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
