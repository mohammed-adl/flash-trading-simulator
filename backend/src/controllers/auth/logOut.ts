import asyncHandler from "express-async-handler";
import { success, fail } from "../../lib/index.js";
import { Request, Response } from "express";
import { authService } from "../../services/index.js";

export const logOut = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user.id;

  const refreshToken = req.body.refreshToken;
  if (!refreshToken) fail("Refresh token not found", 401);

  await authService.logOut(userId, refreshToken);

  res.status(204).end();
});
