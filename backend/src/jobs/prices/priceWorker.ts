import { Worker } from "bullmq";
import { redis } from "../../lib/index.js";
import { fetchAllPrices } from "../../socket/index.js";

export const priceWorker = new Worker(
  "priceQueue",
  async () => {
    console.log("🔄 Fetching all prices via BullMQ...");
    await fetchAllPrices();
  },
  { connection: redis }
);

priceWorker.on("completed", () => console.log("✅ Prices fetched"));
priceWorker.on("failed", (job, err) => console.error("❌ Fetch failed:", err));
