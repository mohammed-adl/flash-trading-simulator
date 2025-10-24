import jwt from "jsonwebtoken";
import { prisma } from "../lib/index.js";
import { AppError } from "../utils/index.js";
import { JwtPayload } from "jsonwebtoken";

export const validateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AppError("Access token not found", 401);
  }

  const accessToken = authHeader.split(" ")[1];
  const payload = jwt.verify(
    accessToken,
    process.env.ACCESS_SECRET!
  ) as JwtPayload;

  const user = await prisma.user.findUnique({
    where: { id: payload.id },
    select: { id: true },
  });
  if (!user) throw new AppError("User not found", 401);

  req.user = payload;

  next();
};

export function validateBodyToken(token: string) {
  const decoded = jwt.verify(token, process.env.ACCESS_SECRET!) as JwtPayload;
  return decoded.id;
}
