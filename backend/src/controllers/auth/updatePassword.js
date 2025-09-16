import asyncHandler from "express-async-handler";
import { success } from "../../lib/index.js";
import { authService } from "../../services/index.js";

export const updatePassword = asyncHandler(async (req, res) => {
  const { newPassword } = req.body;

  await authService.updatePassword(req, newPassword);

  success(res, null);
});
