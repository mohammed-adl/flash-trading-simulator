import { formatCurrency } from "@/utils";

export function RecentTrades({ trades }) {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4 text-foreground">
        Recent Closed Trades History
      </h2>
      {trades.length === 0 && (
        <p className="text-secondary">You have not closed any trades yet.</p>
      )}
      <div className="space-y-3">
        {trades.map((trade, index) => (
          <div
            key={trade.id ?? `trade-${index}`}
            className="flex items-center justify-between p-4 bg-background rounded border border-border"
          >
            <div className="flex items-center gap-4">
              <span
                className={`px-3 py-1 rounded text-xs font-medium ${
                  trade.type === "BUY"
                    ? "bg-up text-background"
                    : "bg-down text-background"
                }`}
              >
                {trade.type}
              </span>
              <div>
                <p className="font-bold text-foreground text-lg">
                  {trade.symbol}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted">
                {formatCurrency(trade.price)}
              </p>
              <p
                className={`font-bold text-lg ${
                  trade.profit >= 0 ? "text-up" : "text-down"
                }`}
              >
                {trade.profit >= 0 ? "+" : ""}
                {formatCurrency(trade.profit)}
              </p>
              <p className="text-xs text-muted">
                {new Date(trade.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
