"use client";

import { createContext, useContext, useState } from "react";
import { useStock } from "./StockContext";

const PortfolioContext = createContext();

export function PortfolioProvider({ children }) {
  const [watchlistDisplay, setWatchlistDisplay] = useState("recentTrades");
  const { stocksPrices } = useStock();

  const sortWatchList = (displayMode = watchlistDisplay) => {
    switch (displayMode) {
      case "topMovers":
        return [...stocksPrices].sort((a, b) => {
          const aChange = ((a.price - a.avgPrice) / a.avgPrice) * 100;
          const bChange = ((b.price - b.avgPrice) / b.avgPrice) * 100;
          return Math.abs(bChange) - Math.abs(aChange); // sort by largest movement
        });

      case "recentTrades":
      default:
        return [...stocksPrices];
    }
  };

  return (
    <PortfolioContext.Provider
      value={{ watchlistDisplay, setWatchlistDisplay, sortWatchList }}
    >
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  return useContext(PortfolioContext);
}
