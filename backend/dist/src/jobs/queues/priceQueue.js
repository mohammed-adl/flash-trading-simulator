import { Queue } from "bullmq";
import { redis } from "../../lib/index.js";
export const priceQueue = new Queue("priceQueue", { connection: redis });
//# sourceMappingURL=priceQueue.js.map