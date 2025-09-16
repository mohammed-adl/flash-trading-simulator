import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

export function TradeOutcomesChart({
  winningTrades,
  losingTrades,
  totalTrades,
}) {
  const tradeOutcomeData =
    totalTrades > 0
      ? [
          {
            name: "Winning Trades",
            value: Math.round((winningTrades / totalTrades) * 100),
            count: winningTrades,
          },
          {
            name: "Losing Trades",
            value: Math.round((losingTrades / totalTrades) * 100),
            count: losingTrades,
          },
        ]
      : [{ name: "No Trades", value: 100, count: 0 }];

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4 text-foreground">Trade Outcomes</h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={tradeOutcomeData}
              cx="50%"
              cy="50%"
              outerRadius={80}
              dataKey="value"
            >
              {tradeOutcomeData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={index === 0 ? "var(--up)" : "var(--down)"}
                />
              ))}
            </Pie>
            <Tooltip
              content={({ payload }) => {
                if (!payload || !payload.length) return null;
                const data = payload[0].payload;
                return (
                  <div
                    style={{
                      background: "var(--card)",
                      color: "var(--foreground)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                      padding: "4px 8px",
                      fontSize: "12px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {data.name}: {data.value}%
                  </div>
                );
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
