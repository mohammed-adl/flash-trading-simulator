"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Package, DollarSign, TrendingUp, TrendingDown } from "lucide-react";

import TradePanel from "./TradePanel";
import StockChart from "./StockChart";

import { useUser, useStock } from "@/contexts";
import { Spinner } from "@/components/ui";
import {
  calcUnrealizedPnLD,
  calcUnrealizedPnLP,
  formatCurrency,
} from "@/utils";
import { handleGetStock } from "@/fetchers";

export default function StockView() {
  const { user } = useUser();
  const { stocksPrices, selectedSymbol } = useStock();
  const [range, setRange] = useState("M");

  const lastActiveSymbol = user.holdings[0]?.symbol;

  const validSymbol = selectedSymbol || lastActiveSymbol || "AMZN";

  const { data, isLoading, error } = useQuery({
    queryKey: ["stockData", selectedSymbol, range],
    queryFn: async () => {
      try {
        return await handleGetStock({
          symbol: validSymbol,
          range,
        });
      } catch (err) {
        throw err;
      }
    },
    retry: 1,
  });

  const stockData = data?.stock;
  const chartData = stockData?.charts || [];

  const quantity = Number(
    stocksPrices.find((s) => s.symbol === validSymbol)?.quantity ?? 0
  );

  const unrealizedPnLD =
    calcUnrealizedPnLD(
      stocksPrices[validSymbol]?.avgPrice ?? 0,
      stocksPrices[validSymbol]?.price ?? 0,
      quantity
    ) || 0;

  const unrealizedPnLP =
    calcUnrealizedPnLP(
      stocksPrices[validSymbol]?.avgPrice ?? 0,
      stocksPrices[validSymbol]?.price ?? 0
    ) || 0;

  const startPrice = chartData[0]?.price ?? 0;
  const endPrice = chartData[chartData.length - 1]?.price ?? 0;
  const trendUp = endPrice >= startPrice;

  const stockSymbol = stockData?.symbol || "";
  const name = stockData?.name || "";
  const price = stockData?.price || 0;

  const percentChange =
    startPrice > 0 ? ((endPrice - startPrice) / startPrice) * 100 : 0;

  const ranges = ["D", "M", "Y"];
  const rangeLabels = {
    D: "Today",
    M: "Last 30 Days",
    Y: "Last 12 Months",
  };

  return (
    <div className="relative bg-card rounded-xl p-6 mb-4 lg:mb-18 border border-border flex flex-col h-[600px] md:h-[600px] lg:h-auto">
      <h2 className="text-lg font-semibold text-foreground flex space-x-1">
        <span>{name}</span>
        <span>({selectedSymbol || stockSymbol})</span>
      </h2>

      {isLoading || error ? (
        <div className="flex-1 flex justify-center items-center mt-4">
          <Spinner className="border-secondary" />
        </div>
      ) : (
        <>
          <p
            className={`text-sm font-medium mt-1 ${
              trendUp ? "text-up" : "text-down"
            }`}
          >
            {percentChange.toFixed(2)}% ({rangeLabels[range]})
          </p>

          <StockChart chartData={chartData} trendUp={trendUp} />
        </>
      )}

      <div className="flex justify-center gap-2 mt-4 mb-6">
        {ranges.map((r) => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={`px-4 py-1 rounded-full text-sm font-medium cursor-pointer transition-colors ${
              range === r
                ? "bg-secondary text-background"
                : "bg-card text-primary border border-border hover:text-foreground"
            }`}
          >
            {r}
          </button>
        ))}
      </div>
      {user.holdings.some((h) => h.symbol === stockSymbol) && (
        <div className="mt-4 flex items-center justify-between rounded-lg border px-4 py-3 bg-card">
          <div className="flex flex-col space-y-1">
            <span className="text-sm font-semibold text-foreground flex items-center gap-1">
              <Package size={14} className="text-muted" />
              {stockSymbol}
            </span>
            <span className="text-xs text-muted flex items-center gap-1">
              <DollarSign size={12} className="text-muted" />
              {quantity} shares · {formatCurrency(price)}
            </span>
          </div>

          <div
            className={`flex items-center text-sm font-semibold gap-1 ${
              unrealizedPnLD >= 0
                ? "text-green-600"
                : unrealizedPnLD < 0
                ? "text-red-600"
                : "text-muted"
            }`}
          >
            {unrealizedPnLD > 0 ? (
              <TrendingUp size={14} />
            ) : unrealizedPnLD < 0 ? (
              <TrendingDown size={14} />
            ) : null}

            <span>
              {unrealizedPnLD > 0 && "+"}
              {formatCurrency(unrealizedPnLD)} ({unrealizedPnLP?.toFixed(2)}%)
            </span>
          </div>
        </div>
      )}

      <TradePanel symbol={selectedSymbol || stockSymbol} price={price} />
    </div>
  );
}
