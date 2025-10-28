import dotenv from "dotenv";
dotenv.config();
import Redis from "ioredis";
const redis = new Redis(process.env.REDIS_URL, {
    maxRetriesPerRequest: null,
});
export default redis;
//# sourceMappingURL=redis.js.map