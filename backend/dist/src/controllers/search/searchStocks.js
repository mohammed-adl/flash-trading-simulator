import asyncHandler from "express-async-handler";
import yahooFinance from "yahoo-finance2";
import { success, fail } from "../../lib/index.js";
export const searchStocks = asyncHandler(async (req, res) => {
    const { q } = req.query;
    const results = await yahooFinance.search(q);
    if (!results || results.length === 0)
        return fail("No results found", 404);
    return success(res, { results });
});
//# sourceMappingURL=searchStocks.js.map