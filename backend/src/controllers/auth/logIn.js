import asyncHandler from "express-async-handler";

import { authService, notificationService } from "../../services/index.js";
import { success, fail, prisma } from "../../lib/index.js";
import { REFRESH_TOKEN_MAX_AGE } from "../../config/constants.js";

const isProd = process.env.NODE_ENV === "production";

export const logIn = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await authService.logIn(email, password);
  if (!user) return fail("Invalid credentials", 401);

  const accessToken = authService.generateAccessToken({
    id: user.id,
  });

  const refreshToken = authService.generateRefreshToken({
    id: user.id,
  });

  await authService.saveRefreshToken(user.id, refreshToken, req);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: isProd,
    maxAge: REFRESH_TOKEN_MAX_AGE,
    sameSite: "none",
    path: "/",
  });

  success(res, {
    token: accessToken,
    user,
  });
});
