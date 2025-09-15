import { Server } from "socket.io";

const ORIGIN = process.env.ORIGIN || "http://localhost:3000";
export let io = null;

export function setupSocket(server) {
  io = new Server(server, {
    cors: { origin: ORIGIN, methods: ["GET", "POST"] },
  });

  return io;
}
