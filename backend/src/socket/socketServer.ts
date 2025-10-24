import { Server } from "socket.io";
import { Server as HTTPServer } from "http";
import setupAuthMiddleware from "./socketMiddleware.js";
import { handleConnection } from "./socketHandlers.js";

const ORIGIN = process.env.ORIGIN || "http://localhost:3000";
export let io: Server | null = null;

export function setupSocket(server: HTTPServer) {
  io = new Server(server, {
    cors: { origin: ORIGIN, methods: ["GET", "POST"] },
  });

  io.use(setupAuthMiddleware);
  io.on("connection", (socket) => handleConnection(io!, socket));

  return io;
}
