"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { socket } from "@/socket";

const AssetContext = createContext();

export function AssetProvider({ children }) {
  const [selectedSymbol, setSelectedSymbol] = useState(null);
  const [assetsPrices, setAssetsPrices] = useState([]);

  useEffect(() => {
    socket.on("assetUpdate", (data) => {
      setAssetsPrices(data);
    });

    return () => {
      socket.off("assetUpdate");
    };
  }, [socket]);

  return (
    <AssetContext.Provider
      value={{
        selectedSymbol,
        setSelectedSymbol,
        assetsPrices,
      }}
    >
      {children}
    </AssetContext.Provider>
  );
}

export function useAsset() {
  return useContext(AssetContext);
}
