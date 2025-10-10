import asyncHandler from "express-async-handler";
import { prisma, success, userSelect } from "../../lib/index.js";
import { notificationService, redisService } from "../../services/index.js";
import { INITIAL_BALANCE } from "../../config/index.js";

export const resetProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const result = await prisma.$transaction(async (tx) => {
    await tx.holding.deleteMany({ where: { userId } });
    await tx.trade.deleteMany({ where: { userId } });
    await tx.transaction.deleteMany({ where: { userId } });

    const user = await tx.user.update({
      where: { id: userId },
      data: {
        balance: INITIAL_BALANCE,
        profits: 0,
      },
      select: userSelect,
    });

    await tx.transaction.create({
      data: {
        userId: userId,
        type: "DEPOSIT",
        amount: INITIAL_BALANCE,
      },
    });

    return { user };
  });

  const keysToDelete = [
    `user:${userId}:positions`,
    `user:${userId}:tradeStats`,
    `user:${userId}:monthlyRealizedPnL`,
    `user:${userId}:dailyTrades`,
    `user:${userId}:monthlyWinningTrades`,
  ];
  for (const key of keysToDelete) {
    await redisService.del(key);
  }

  await redisService.set(`user:${userId}:transactions`, {
    totalDeposits: INITIAL_BALANCE,
    totalWithdrawals: 0,
  })

    notificationService.createReset(userId);

  return success(res, { user: result.user });
});
