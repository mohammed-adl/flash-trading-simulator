import { reqApi } from "@/lib";

export async function handleSearchStocks(query) {
  return await reqApi(`/search?q=${query}`);
}

export async function handleGetStock({ symbol, range }) {
  return await reqApi(`/stocks/${symbol}?range=${range}`);
}

export async function handleBuyStock({ symbol, quantity }) {
  return await reqApi(`/stocks/${symbol}/buy`, {
    method: "POST",
    body: { quantity },
  });
}

export async function handleSellStock({ symbol, quantity }) {
  return await reqApi(`/stocks/${symbol}/sell`, {
    method: "POST",
    body: { quantity },
  });
}
