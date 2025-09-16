import { Server } from "socket.io";
import setupAuthMiddleware from "./socketMiddleware.js";
import { handleConnection } from "./socketHandlers.js";

const ORIGIN = process.env.ORIGIN || "http://localhost:3000";
export let io = null;

export function setupSocket(server) {
  io = new Server(server, {
    cors: { origin: ORIGIN, methods: ["GET", "POST"] },
  });

  io.use(setupAuthMiddleware);

  io.on("connection", handleConnection);
  return io;
}
