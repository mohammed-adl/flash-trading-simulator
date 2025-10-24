import asyncHandler from "express-async-handler";
import yahooFinance from "yahoo-finance2";
import { success, fail } from "../../lib/index.js";

export const searchAssets = asyncHandler(async (req, res) => {
  const { q } = req.query as { q: string };

  const results = await yahooFinance.search(q);
  if (!results?.quotes || results.quotes.length === 0)
    return fail("No results found", 404);

  return success(res, { results });
});
