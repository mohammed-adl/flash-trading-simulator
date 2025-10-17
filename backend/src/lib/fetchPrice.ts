import asyncHandler from "express-async-handler";
import yahooFinance from "yahoo-finance2";
import { success, fail } from "../lib/index.js";

export async function fetchPrice(symbol: string) {
  const quote = await yahooFinance.quote(symbol);
  if (!quote) throw new Error("Price not found");

  const price = Number(quote.regularMarketPrice) as number;
  const name = quote.shortName || symbol;

  return { name, symbol, price };
}