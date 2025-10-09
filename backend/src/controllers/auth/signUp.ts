import asyncHandler from "express-async-handler";
import { success } from "../../lib/index.js";
import { authService, redisService } from "../../services/index.js";
import { INITIAL_BALANCE } from "../../config/index.js";

const isProd = process.env.NODE_ENV === "production";

export const signUp = asyncHandler(async (req, res) => {
  const { ...formData } = req.body;

  const user = await authService.createUser(formData);

  const accessToken = authService.generateAccessToken({
    id: user.id,
  });

  const refreshToken = authService.generateRefreshToken({
    id: user.id,
  });

  await authService.saveRefreshToken(user.id, refreshToken, req);

  await redisService.setTransactions(user.id, INITIAL_BALANCE, "DEPOSIT");

  success(
    res,
    {
      token: accessToken,
      refreshToken,
      user,
    },
    201
  );
});
