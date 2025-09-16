import cors from "cors";
import helmet from "helmet";
import express from "express";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import morgan from "morgan";

const ORIGIN = process.env.ORIGIN;
import { RATE_LIMIT } from "../config/constants.js";

const generalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: RATE_LIMIT,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    message: "Too many requests, please try again later.",
  },
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    message: "Too many login attempts, please try again later.",
  },
});

export const registerMiddlewares = (app) => {
  const allowedOrigins = [
    "https://flash-sim.vercel.app",
    "http://localhost:3000",
  ];
  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin))
          return callback(null, true);
        callback(new Error("Not allowed by CORS"));
      },
      credentials: true,
    })
  );
  app.use(
    cors({
      origin: true,
      credentials: true,
    })
  );
  app.use(cookieParser());
  app.use(helmet());
  app.use(generalLimiter);
  app.use(express.json());
  app.use(morgan("dev"));
};
