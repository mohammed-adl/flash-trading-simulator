"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export function PortfolioPerformanceChart({ data }) {
  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
  const normalizedData = [...data];
  if (!data.some((item) => item.date.startsWith(currentMonth))) {
    normalizedData.push({ date: currentMonth, pnl: 0 });
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4 text-foreground">
        Portfolio Performance
      </h2>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={normalizedData}>
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--muted)", fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--muted)", fontSize: 12 }}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                color: "var(--foreground)",
              }}
              formatter={(value) => [`$${value.toLocaleString()}`, "PnL"]}
            />
            <Line
              type="monotone"
              dataKey="pnl"
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
