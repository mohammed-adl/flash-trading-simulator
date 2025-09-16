export const getMonthlyPerformance = (monthlyWins) => {
  monthlyWins = monthlyWins || {};
  const now = new Date();
  const currentMonthKey = now.toISOString().slice(0, 7);
  if (!monthlyWins[currentMonthKey]) monthlyWins[currentMonthKey] = 0;
  return Object.entries(monthlyWins)
    .map(([monthKey, wins]) => {
      const [year, month] = monthKey.split("-");
      const monthName = new Date(year, month - 1).toLocaleString("default", {
        month: "short",
      });
      return { month: monthName, wins };
    })
    .sort((a, b) => new Date(a.month) - new Date(b.month));
};

export const getTradingActivityByDay = (dailyTrades) => {
  const last7Dates = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d;
  });

  return last7Dates.map((date) => {
    const dateStr = date.toISOString().slice(0, 10);
    const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
    return {
      day: dayName,
      trades: dailyTrades[dateStr] || 0,
    };
  });
};
