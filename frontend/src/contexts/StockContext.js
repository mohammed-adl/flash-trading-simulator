"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { socket } from "@/socket";

const StockContext = createContext();

export function StockProvider({ children }) {
  const [selectedSymbol, setSelectedSymbol] = useState(null);
  const [stocksPrices, setStocksPrices] = useState([]);

  useEffect(() => {
    socket.on("stockUpdate", (data) => {
      setStocksPrices(data);
    });

    return () => {
      socket.off("stockUpdate");
    };
  }, [socket]);

  return (
    <StockContext.Provider
      value={{
        selectedSymbol,
        setSelectedSymbol,
        stocksPrices,
      }}
    >
      {children}
    </StockContext.Provider>
  );
}

export function useStock() {
  return useContext(StockContext);
}
