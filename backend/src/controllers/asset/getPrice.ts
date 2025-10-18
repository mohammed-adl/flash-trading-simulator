import asyncHandler from "express-async-handler";

import { success, fail, fetchPrice } from "../../lib/index.js";
import { assetsCache, marketWatchlist } from "../../socket/index.js";

export const getPrice = asyncHandler(async (req, res) => {
  const { symbol } = req.params;

  let price = 0;
  let name = "";

  const cached = assetsCache.get(symbol);
  if (cached) {
    price = cached.price;
    name = cached.name;
  }

  if (price === undefined) {
    const stock = await fetchPrice(symbol);
    assetsCache.set(symbol, { name: stock.name, price: stock.price });

    marketWatchlist.add(symbol);
    return fail("Stock not found", 404);
  }

  return success(res, { stock: { name, price } });
});
