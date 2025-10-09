import asyncHandler from "express-async-handler";

import {
  success,
  fail,
  prisma,
  userSelect,
  transactionSelect,
} from "../../lib/index.js";
import { DEPOSIT_LIMIT } from "../../config/index.js";
import { redisService } from "../../services/index.js";

export const deposit = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { amount } = req.body;

  if (amount > DEPOSIT_LIMIT)
    return fail("You exceeded the deposit limit", 400);

  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.update({
      where: { id: userId },
      data: { balance: { increment: amount } },
      select: userSelect,
    });

    const transaction = await tx.transaction.create({
      data: {
        type: "DEPOSIT",
        amount,
        userId: userId,
      },
      select: transactionSelect,
    });

    return { user, transaction };
  });

  await redisService.setTransactions(userId, amount, "DEPOSIT");

  return success(
    res,
    { user: result.user, transaction: result.transaction },
    201
  );
});
