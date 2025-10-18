import asyncHandler from "express-async-handler";
import { success, fail, fetchPrice } from "../../lib/index.js";
export const getStock = asyncHandler(async (req, res) => {
    const { symbol } = req.params;
    const { range } = req.query;
    let interval = "1d";
    let yahooRange = "1mo";
    if (range === "D") {
        interval = "1h";
        yahooRange = "1d";
    }
    else if (range === "M") {
        interval = "1d";
        yahooRange = "1mo";
    }
    else if (range === "Y") {
        interval = "1wk";
        yahooRange = "1y";
    }
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=${interval}&range=${yahooRange}`;
    const response = await fetch(url);
    if (!response.ok)
        return fail("Error fetching chart data", response.status);
    const data = await response.json();
    if (!data.chart || !data.chart.result)
        return fail("Invalid chart data", 400);
    const result = data.chart.result[0];
    const timestamps = result.timestamp;
    const closes = result.indicators.quote[0].close;
    const chartData = timestamps.map((ts, i) => {
        const date = new Date(ts * 1000);
        return {
            date: date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: range === "Y" ? "numeric" : undefined,
            }),
            price: closes[i],
        };
    });
    const quote = await fetchPrice(symbol);
    return success(res, {
        stock: {
            name: quote.name,
            symbol: quote.symbol,
            price: quote.price,
            charts: chartData,
        },
    });
});
//# sourceMappingURL=getAsset.js.map