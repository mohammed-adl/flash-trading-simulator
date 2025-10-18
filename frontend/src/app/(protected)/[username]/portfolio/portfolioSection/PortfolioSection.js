"use client";

import { useQuery } from "@tanstack/react-query";

import { LoadingScreen } from "@/components/ui";
import { useUser, useAsset } from "@/contexts";
import { calcPortfolioValue, formatCurrency } from "@/utils";
import { handleGetPortfolio } from "@/fetchers";

import { PortfolioStats } from "./PortfolioStats";
import { PortfolioPerformanceChart } from "./PortfolioPerformanceChart";
import { HoldingsDistributionChart } from "./HoldingsDistributionChart";
import { RecentTrades } from "./RecentTrades";

export default function PortfolioSection() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["portfolio"],
    queryFn: async () => {
      try {
        return await handleGetPortfolio();
      } catch (err) {
        throw err;
      }
    },
    retry: 1,
  });

  const { user } = useUser();
  const { assetsPrices } = useAsset();

  if (isLoading || error) return <LoadingScreen />;

  const trades = data.trades;
  const { totalDeposits, totalWithdrawals, monthlyRealizedPnL } = data.stats;

  const portfolioValue = calcPortfolioValue(user.balance, assetsPrices);
  const holdingsValue = portfolioValue - Number(user.balance);

  const totalHoldings = user.holdings.length;

  const monthlyPnLArray = Object.entries(monthlyRealizedPnL || {}).map(
    ([date, pnl]) => ({ date, pnl: Number(pnl) })
  );

  const totalPnL = monthlyPnLArray.reduce((acc, m) => acc + m.pnl, 0);
  const netDeposits = totalDeposits - totalWithdrawals;
  const returnPercent = netDeposits > 0 ? (totalPnL / netDeposits) * 100 : 0;

  const holdingsData = assetsPrices.map((stock) => ({
    name: stock.symbol,
    value: ((stock.price * stock.quantity) / portfolioValue) * 100,
    amount: stock.price * stock.quantity,
  }));

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <PortfolioStats
          holdingsValue={holdingsValue}
          totalPnL={totalPnL}
          returnPercent={returnPercent}
          totalHoldings={totalHoldings}
        />

        <PortfolioPerformanceChart data={monthlyPnLArray} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <HoldingsDistributionChart data={holdingsData} />
          <RecentTrades trades={trades} />
        </div>
      </div>
    </div>
  );
}
