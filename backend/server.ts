import dotenv from "dotenv";
dotenv.config();

import http from "http";
import app from "./app.js";
import { setupSocket } from "./src/socket/index.js";

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;

const server = http.createServer(app);
setupSocket(server);

server.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
