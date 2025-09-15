import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
const PORT = process.env.PORT || 3001;

import http from "http";
import { setupSocket } from "./src/socket/index.js";

const server = http.createServer(app);
setupSocket(server);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
