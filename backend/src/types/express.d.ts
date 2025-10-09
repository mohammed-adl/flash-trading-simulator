import { Express } from "express";

declare global {
  namespace Express {
    interface Request {
      user: {
        id: string;
      };
    }
  }
}

declare module "socket.io" {
  interface Socket {
    userId?: string;
  }
}