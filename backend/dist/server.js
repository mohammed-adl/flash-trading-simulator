import dotenv from "dotenv";
dotenv.config();
import http from "http";
import app from "./app.js";
import { setupSocket } from "./src/socket/index.js";
import { schedulePriceFetch } from "./src/jobs/prices/index.js";
const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
const server = http.createServer(app);
setupSocket(server);
server.listen(PORT, "0.0.0.0", async () => {
    console.log(`✅ Server is running on port ${PORT}`);
    try {
        await schedulePriceFetch();
        console.log("Price fetch job scheduled successfully!");
    }
    catch (err) {
        console.error("Failed to schedule price fetch job:", err);
    }
});
//# sourceMappingURL=server.js.map