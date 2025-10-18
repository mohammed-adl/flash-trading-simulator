"use client";

import { useQuery } from "@tanstack/react-query";
import { useAsset } from "@/contexts";
import { LoadingScreen } from "@/components/ui";
import { handleGetTrades } from "@/fetchers";
import { TradeStats } from "./TradeStats";
import { MonthlyPerformanceChart } from "./MonthlyPerformanceChart";
import { TradeOutcomesChart } from "./TradeOutcomesChart";
import { TradingActivityChart } from "./TradingActivityChart";
import { RecentTrades } from "./RecentTrades";
import { getMonthlyPerformance, getTradingActivityByDay } from "@/utils";

export default function TradesSection() {
  const { assetsPrices } = useAsset();

  const { data, isLoading, error } = useQuery({
    queryKey: ["trades"],
    queryFn: async () => {
      try {
        return await handleGetTrades();
      } catch (err) {
        throw err;
      }
    },
    retry: 1,
  });

  if (isLoading || error) return <LoadingScreen />;

  const trades = data.trades;
  const {
    totalTrades,
    winningTrades,
    losingTrades,
    avgPnl,
    winRate,
    realizedPnL,
  } = data.stats;

  const dailyTrades = data.performance.dailyTrades;
  const monthlyWinningTrades = data.performance.monthlyWinningTrades;

  return (
    <div className="h-full overflow-y-auto bg-background text-foreground">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <TradeStats
          totalTrades={totalTrades}
          winRate={winRate}
          realizedPnL={realizedPnL}
          avgPnl={avgPnl}
        />
        <MonthlyPerformanceChart
          data={getMonthlyPerformance(monthlyWinningTrades)}
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TradeOutcomesChart
            winningTrades={winningTrades}
            losingTrades={losingTrades}
            totalTrades={totalTrades}
          />
          <TradingActivityChart data={getTradingActivityByDay(dailyTrades)} />{" "}
        </div>
        <RecentTrades trades={trades} assetsPrices={assetsPrices} />
      </div>
    </div>
  );
}
