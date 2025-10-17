import yahooFinance from "yahoo-finance2";
export async function fetchPrice(symbol) {
    const quote = await yahooFinance.quote(symbol);
    if (!quote)
        throw new Error("Price not found");
    const price = Number(quote.regularMarketPrice);
    const name = quote.shortName || symbol;
    return { name, symbol, price };
}
//# sourceMappingURL=fetchPrice.js.map