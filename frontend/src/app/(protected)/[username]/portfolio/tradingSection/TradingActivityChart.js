import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export function TradingActivityChart({ data }) {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4 text-foreground">
        Trading Activity by Day
      </h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--muted)", fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--muted)", fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                color: "var(--foreground)",
              }}
              formatter={(value, name) => {
                if (name === "trades") return [value, "Trades"];
                if (name === "volume")
                  return [`$${value.toLocaleString()}`, "Volume"];
                return [value, name];
              }}
            />
            <Bar dataKey="trades" fill="var(--secondary)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
