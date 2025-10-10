import asyncHandler from "express-async-handler";

import {
  success,
  fail,
  prisma,
  userSelect,
  transactionSelect,
} from "../../lib/index.js";
import { redisService } from "../../services/index.js";

export const withdraw = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { amount } = req.body;

  const userBalance = await prisma.user.findUnique({
    where: { id: userId },
    select: { balance: true },
  });

  if (userBalance!.balance < amount)
    return fail("You don't have enough balance", 400);

  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.update({
      where: { id: userId },
      data: { balance: { decrement: amount } },
      select: userSelect,
    });

    const transaction = await tx.transaction.create({
      data: {
        type: "WITHDRAWAL",
        amount,
        userId: userId,
      },
      select: transactionSelect,
    });

    return { user, transaction };
  });

  await redisService.setTransactions(userId, amount, "WITHDRAWAL");

  return success(res, {
    user: result.user,
    transaction: result.transaction,
  });
});
