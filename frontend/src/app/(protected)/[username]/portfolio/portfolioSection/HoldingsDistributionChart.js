import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

const COLORS = [
  "var(--up)",
  "var(--secondary)",
  "var(--down)",
  "var(--muted)",
  "var(--primary)",
];

export function HoldingsDistributionChart({ data }) {
  const chartData =
    data && data.length > 0
      ? data
      : [{ name: "No Holdings", value: 100, amount: 0 }];

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4 text-foreground">
        Holdings Distribution
      </h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              outerRadius={80}
              dataKey="value"
              labelLine={({ value }) => (value < 3 ? false : true)}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    entry.name === "No Holdings"
                      ? "var(--up)"
                      : COLORS[index % COLORS.length]
                  }
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
                    {data.name}: ${data.amount.toLocaleString()}
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
