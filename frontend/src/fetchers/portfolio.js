import { reqApi } from "@/lib/axios";

export async function handleGetPortfolio() {
  return await reqApi(`/portfolio`);
}

export async function handleGetTrades() {
  return await reqApi(`/portfolio/trades`);
}
