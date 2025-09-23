import asyncHandler from "express-async-handler";

import { authService } from "../../services/index.js";
import { success, fail } from "../../lib/index.js";

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

  await authService.saveRefreshToken(user.id, refreshToken);

  success(res, {
    token: accessToken,
    refreshToken,
    user,
  });
});
