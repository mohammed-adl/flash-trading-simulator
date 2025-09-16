import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export function MonthlyPerformanceChart({ data }) {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4 text-foreground">
        Monthly Trading Performance
      </h2>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis
              dataKey="month"
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
                if (name === "wins") return [value, "Winning Trades"];
                return [value, name];
              }}
            />
            <Line
              type="monotone"
              dataKey="wins"
              stroke="var(--up)"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, fill: "var(--up)" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
