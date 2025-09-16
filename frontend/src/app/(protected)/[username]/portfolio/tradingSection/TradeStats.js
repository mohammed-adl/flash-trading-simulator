import { formatCurrency } from "@/utils";

export function TradeStats({ totalTrades, winRate, realizedPnL, avgPnl }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="text-muted text-sm">Total Trades</h3>
        <p className="text-2xl font-bold text-foreground">{totalTrades}</p>
      </div>
      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="text-muted text-sm">Win Rate</h3>
        <p className="text-2xl font-bold text-up">
          {(winRate ?? 0).toFixed(2)}%
        </p>
      </div>
      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="text-muted text-sm">Realized P&L</h3>
        <p
          className={`text-2xl font-bold ${
            realizedPnL >= 0 ? "text-up" : "text-down"
          }`}
        >
          {realizedPnL >= 0 ? "+" : ""}
          {formatCurrency(realizedPnL) || 0}
        </p>
      </div>
      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="text-muted text-sm">Avg P&L/Trade</h3>
        <p
          className={`text-2xl font-bold ${
            avgPnl >= 0 ? "text-up" : "text-down"
          }`}
        >
          {formatCurrency(avgPnl)}
        </p>
      </div>
    </div>
  );
}
