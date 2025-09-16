export function RecentTrades({ trades }) {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4 text-foreground">Recent Trades</h2>
      {trades.length === 0 && (
        <p className="text-sm text-secondary"> You have no trades.</p>
      )}
      <div className="space-y-3">
        {trades.map((trade, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 bg-background rounded border border-border"
          >
            <div className="flex items-center gap-3">
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${
                  trade.type === "BUY"
                    ? "bg-up text-background"
                    : "bg-down text-background"
                }`}
              >
                {trade.type}
              </span>
              <div>
                <p className="font-medium text-foreground">{trade.symbol}</p>
                <p className="text-sm text-muted">
                  {trade.quantity} shares @ ${trade.price}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p
                className={`font-medium ${
                  trade.profit >= 0 ? "text-up" : "text-down"
                }`}
              >
                {`$${
                  trade?.profit != null
                    ? Math.abs(Number(trade.profit)).toFixed(2)
                    : "0.00"
                }`}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
