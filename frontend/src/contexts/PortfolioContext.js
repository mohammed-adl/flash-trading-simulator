"use client";

import { createContext, useContext, useState } from "react";
import { useAsset } from "./AssetContext";

const PortfolioContext = createContext();

export function PortfolioProvider({ children }) {
  const [watchlistDisplay, setWatchlistDisplay] = useState("recentTrades");
  const { assetsPrices } = useAsset();

  const sortWatchList = (displayMode = watchlistDisplay) => {
    switch (displayMode) {
      case "topMovers":
        return [...assetsPrices].sort((a, b) => {
          const aChange = ((a.price - a.avgPrice) / a.avgPrice) * 100;
          const bChange = ((b.price - b.avgPrice) / b.avgPrice) * 100;
          return Math.abs(bChange) - Math.abs(aChange); // sort by largest movement
        });

      case "recentTrades":
      default:
        return [...assetsPrices];
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
