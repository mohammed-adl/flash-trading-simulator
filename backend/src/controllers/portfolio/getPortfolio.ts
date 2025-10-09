import asyncHandler from "express-async-handler";
import { prisma, success } from "../../lib/index.js";
import { redisService } from "../../services/index.js";

export const getPortfolio = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const trades = await prisma.trade.findMany({
    where: { userId: userId },
    orderBy: { createdAt: "desc" },
    take: 4,
  });

  const { totalDeposits = 0, totalWithdrawals = 0 } =
    await redisService.getTransactions(userId);

  const monthlyRealizedPnL = await redisService.getMonthlyRealizedPnL(userId);

  const tradeStats = await redisService.getTradeStats(userId);

  const {
    largestWin = 0,
    largestLoss = 0,
    avgWin = 0,
    avgLoss = 0,
    lastTrade = null,
    totalSharesTraded = 0,
    winRate = 0,
  } = tradeStats;

  const stats = {
    totalDeposits,
    totalWithdrawals,
    monthlyRealizedPnL,
    largestWin,
    largestLoss,
    avgWin,
    avgLoss,
    lastTrade,
    totalSharesTraded,
    winRate,
  };

  return success(res, {
    trades,
    stats,
  });
});
