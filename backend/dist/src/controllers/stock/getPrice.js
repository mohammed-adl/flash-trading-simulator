import asyncHandler from "express-async-handler";
import { success, fail, fetchPrice } from "../../lib/index.js";
import { stockCache, marketWatchlist } from "../../socket/index.js";
export const getPrice = asyncHandler(async (req, res) => {
    const { symbol } = req.params;
    let price;
    let name;
    const cached = stockCache.get(symbol);
    if (cached) {
        price = cached.price;
        name = cached.name;
    }
    if (price === undefined) {
        const stock = await fetchPrice(symbol);
        stockCache.set(symbol, { name: stock.name, price: stock.price });
        marketWatchlist.add(symbol);
        return fail("Stock not found", 404);
    }
    return success(res, { stock: { name, price } });
});
//# sourceMappingURL=getPrice.js.map