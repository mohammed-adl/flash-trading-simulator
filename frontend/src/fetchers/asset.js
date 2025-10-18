import { reqApi } from "@/lib";

export async function handleSearchAssets(query) {
  return await reqApi(`/search?q=${query}`);
}

export async function handleGetAsset({ symbol, range }) {
  return await reqApi(`/assets/${symbol}?range=${range}`);
}

export async function handleBuyAsset({ symbol, quantity }) {
  return await reqApi(`/assets/${symbol}/buy`, {
    method: "POST",
    body: { quantity },
  });
}

export async function handleSellAsset({ symbol, quantity }) {
  return await reqApi(`/assets/${symbol}/sell`, {
    method: "POST",
    body: { quantity },
  });
}
