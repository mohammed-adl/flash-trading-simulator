import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";

import { prisma, success, fail, userSelect } from "../../lib/index.js";
import { authService } from "../../services/index.js";


export const refreshToken = asyncHandler(async (req, res) => {
  const refreshToken = req.body.refreshToken;

  if (!refreshToken) fail("Refresh token not found", 401);

  const payload = await authService.verifyRefreshToken(refreshToken);

  const tokens = await prisma.refreshToken.findMany({
    where: {
      userId: payload.id,
      expiresAt: { gt: new Date() },
    },
  });

  let validToken: typeof tokens[0] | null = null;
  for (const token of tokens) {
    const isValid = await bcrypt.compare(refreshToken, token.token);
    if (isValid) {
      validToken = token;
      break;
    }
  }
  if (!validToken) fail("Invalid refresh token", 401);

  await prisma.refreshToken.delete({
    where: { id: validToken?.id },
  });

  const user = await prisma.user.findUnique({
    where: { id: payload.id },
    select: userSelect,
  });

  const newAccessToken = authService.generateAccessToken({
    id: payload.id,
  });

  const newRefreshToken = authService.generateRefreshToken({
    id: payload.id,
  });

  await authService.saveRefreshToken(payload.id, newRefreshToken);

  success(res, { user, token: newAccessToken, refreshToken: newRefreshToken });
});
