import yahooFinance from "yahoo-finance2";

import { calcPnLPercent } from "../utils/index.js";
import { notificationService, redisService } from "../services/index.js";
import { PRICES_UPDATE_INTERVAL } from "../config/index.js";

export const stockCache: Map<string, { name: string; price: number }> = new Map();
export let marketWatchlist: Set<string> = new Set();

// Fetch and cache a single symbol price
export async function fetchStockPrice(symbol: string) {
  if (!marketWatchlist.has(symbol)) marketWatchlist.add(symbol);

  try {
    const quote = await yahooFinance.quote(symbol);  // Add symbol here
    stockCache.set(symbol, {
      name: quote.shortName || "",
      price: quote.regularMarketPrice || 0,
    });

  } catch (err: any) {
    console.error(`Error fetching ${symbol}:`, err.message);
  }
}

interface Position {
  symbol: string;
  avgPrice: string;
  quantity: number;
  price: string;
  name?: string;
  [key: string]: any;
}

interface UserPositions {
  [symbol: string]: Position;
}

// Send notification if PnL is greater than 5% or less than -5%
async function watchMilestone(userPositions: UserPositions, userId: string) {
  const positionsArray = Object.values(userPositions || {});

  for (const pos of positionsArray) {
    const pnlPercent = calcPnLPercent(
      parseFloat(pos.avgPrice),
      parseFloat(pos.price)
    );

    if (pnlPercent >= 5 || pnlPercent <= -5) {
      const direction = pnlPercent > 0 ? "profit" : "loss";

      try {
        await notificationService.createWarning(userId, pos.symbol, direction);
      } catch (err: any) {
        console.error("Error sending milestone notification:", err.message);
      }
    }
  }
}


// Fetch user positions from Redis
export async function fetchUserPositions(userId: string) {
  try {
    const userPositions = await redisService.getPositions(userId);

    await watchMilestone(userPositions, userId);

    return userPositions;
  } catch (err: any) {
    console.error("Redis fetch error:", err.message);
    return {};
  }
}

// Build watchlist data to send to client
export async function buildWatchlistData(clientWatchlist: string[], userPositions: UserPositions) {
 const data: any[] = [];
 
  for (const sym of clientWatchlist) {
    if (!stockCache.has(sym)) {
      await fetchStockPrice(sym);
    }

    const { price, name: cachedName } = stockCache.get(sym) || {};
    const { name, avgPrice, quantity } = userPositions[sym] || {};

    data.push({
      symbol: sym,
      name: name || cachedName || sym,
      price: price || 0,
      avgPrice: avgPrice || 0,
      quantity: quantity || 0,
    });
  }

  return data;
}

// Periodically fetch all prices for marketWatchlist and update the cache
export async function fetchAllPrices() {
  if (marketWatchlist.size === 0) return;

  try {
    const symbols = Array.from(marketWatchlist);
    const quotes: any[] = await Promise.all(
      symbols.map((sym) =>
        yahooFinance.quote(sym).catch((err) => {
          console.error(`Error fetching ${sym}:`, err.message);
          return null;
        })
      )
    );

    quotes.forEach((quote, i) => {
      if (quote) {
        stockCache.set(symbols[i], {
          name: quote.shortName,
          price: quote.regularMarketPrice,
        });
      }
    });
  } catch (err: any) {
    console.error("Error in fetchAllPrices:", err.message);
  }
}

setInterval(fetchAllPrices, PRICES_UPDATE_INTERVAL);
