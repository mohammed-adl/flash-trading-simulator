import { ArrowUpRight, ArrowDownRight } from "lucide-react";

import SimpleBar from "simplebar-react";
import { useUser, useStock, usePortfolio } from "@/contexts";
import {
  calcTUnrealizedPnLD,
  calcTUnrealizedPnLP,
  calcUnrealizedPnLP,
  formatCurrency,
} from "@/utils";

export default function WatchList() {
  const { setSelectedSymbol, stocksPrices } = useStock();
  const { user } = useUser();
  const { watchlistDisplay, sortWatchList } = usePortfolio();

  const totalPnLD = calcTUnrealizedPnLD(stocksPrices);
  const totalPnLP = calcTUnrealizedPnLP(stocksPrices);
  const sortedStocks = sortWatchList(watchlistDisplay);

  return (
    <SimpleBar className="relative h-screen lg:h-screen max-lg:h-[600px] max-md:h-[600px] bg-card rounded-xl p-6 border border-border">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Watchlist</h2>

        {user.holdings.length > 0 && (
          <span
            className={
              totalPnLD >= 0
                ? "text-green-500 font-medium flex items-center"
                : totalPnLD < 0
                ? "text-red-500 font-medium flex items-center"
                : "text-muted-foreground font-medium flex items-center"
            }
          >
            {`${formatCurrency(Math.abs(totalPnLD))} (${Math.abs(
              Number(totalPnLP)
            ).toFixed(2)}%)`}

            {totalPnLD >= 0 ? (
              <ArrowUpRight className="inline ml-1 w-4 h-4" />
            ) : totalPnLD < 0 ? (
              <ArrowDownRight className="inline ml-1 w-4 h-4" />
            ) : (
              <ArrowUpRight className="inline ml-1 w-4 h-4" />
            )}
          </span>
        )}
      </div>

      {sortedStocks.length > 0 ? (
        <ul className="space-y-3">
          {sortedStocks.map((stock) => {
            const pnlPercent = calcUnrealizedPnLP(stock.avgPrice, stock.price);

            const arrowColorClass =
              pnlPercent > 0
                ? "text-green-500"
                : pnlPercent < 0
                ? "text-red-500"
                : "text-green-500";

            return (
              <li
                key={stock.symbol}
                className="flex justify-between items-center hover:bg-border/60 hover:cursor-pointer rounded-lg p-3 transition"
                onClick={() => setSelectedSymbol(stock.symbol)}
              >
                <div>
                  <p className="font-medium">{stock.symbol}</p>
                  <p className="text-sm text-primary">
                    {formatCurrency(stock.price)}
                  </p>
                </div>

                <span
                  className={`font-medium flex items-center ${arrowColorClass}`}
                >
                  {`${Math.abs(pnlPercent).toFixed(2)}%`}
                  {pnlPercent > 0 ? (
                    <ArrowUpRight className="inline ml-1 w-4 h-4" />
                  ) : pnlPercent < 0 ? (
                    <ArrowDownRight className="inline ml-1 w-4 h-4" />
                  ) : (
                    <ArrowUpRight className="inline ml-1 w-4 h-4" />
                  )}
                </span>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="text-muted"> You have no opening trades.</div>
      )}
    </SimpleBar>
  );
}
