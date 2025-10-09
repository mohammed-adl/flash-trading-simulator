import asyncHandler from "express-async-handler";
import yahooFinance from "yahoo-finance2";
import { fail } from "../lib/index.js";
export const fetchPrice = asyncHandler(async (symbol) => {
    const quote = await yahooFinance.quote(symbol);
    if (!quote)
        return fail("Price not found", 404);
    const price = quote.regularMarketPrice;
    const name = quote.shortName || symbol;
    return { name, symbol, price };
});
//# sourceMappingURL=fetchPrice.js.map