import { Worker } from "bullmq";
import { redis } from "../../lib/index.js";
import { priceQueue } from "../queues/priceQueue.js";
import { fetchAllPrices } from "../../socket/index.js";
export const worker = new Worker(priceQueue.name, async (job) => {
    console.log(`🔔 Job received: ${job.name}`);
    try {
        await fetchAllPrices();
        console.log("✅ Prices fetched successfully");
    }
    catch (err) {
        console.error("❌ Error fetching prices:", err);
        throw err;
    }
}, {
    connection: redis,
    concurrency: 20,
});
worker.on("completed", (job) => console.log(`✅ Job completed: ${job.name}`));
worker.on("failed", (job, err) => console.error(`❌ Job failed: ${job?.name}`, err));
console.log("💻 Price worker is running...");
//# sourceMappingURL=priceWorker.js.map