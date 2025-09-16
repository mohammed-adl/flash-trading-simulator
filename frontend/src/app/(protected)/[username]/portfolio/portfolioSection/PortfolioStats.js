import { formatCurrency } from "@/utils";

export function PortfolioStats({
  holdingsValue,
  totalPnL,
  returnPercent,
  totalHoldings,
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="text-muted text-sm">Holdings Value</h3>
        <p
          className={`text-2xl font-bold ${
            holdingsValue >= 0 ? "text-up" : "text-down"
          }`}
        >
          {formatCurrency(holdingsValue)}
        </p>
      </div>

      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="text-muted text-sm">Total Profit/Loss</h3>
        <p
          className={`text-2xl font-bold ${
            totalPnL >= 0 ? "text-up" : "text-down"
          }`}
        >
          {formatCurrency(totalPnL)}
        </p>
      </div>
      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="text-muted text-sm">Return %</h3>
        <p
          className={`text-2xl font-bold ${
            returnPercent >= 0 ? "text-up" : "text-down"
          }`}
        >
          {totalPnL >= 0 ? "+" : ""}
          {returnPercent.toFixed(2)}%
        </p>
      </div>
      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="text-muted text-sm">Holdings</h3>
        <p className="text-2xl font-bold text-foreground">{totalHoldings}</p>
      </div>
    </div>
  );
}
