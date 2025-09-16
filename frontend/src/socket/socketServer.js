import { io } from "socket.io-client";
const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";

export const socket = io(API_URL, {
  autoConnect: false,
  auth: {},
});
