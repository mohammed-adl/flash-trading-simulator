import asyncHandler from "express-async-handler";
import { prisma, success } from "../../lib/index.js";
import { redisService } from "../../services/index.js";

export const getTrades = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const trades = await prisma.trade.findMany({
    where: { userId: userId, type: "SELL" },
    orderBy: { createdAt: "desc" },
    take: 4,
  });

  const statsKey = `user:${userId}:tradeStats`;
  const stats = (await redisService.get(statsKey)) || {};

  const {
    realizedPnL = 0,
    totalTrades = 0,
    winningTrades = 0,
    losingTrades = 0,
    winRate = 0,
    avgPnl = 0,
  } = stats;

  const dailyTrades =
    (await redisService.get(`user:${userId}:dailyTrades`)) || {};
  const monthlyWinningTrades =
    (await redisService.get(`user:${userId}:monthlyWinningTrades`)) || {};

  return success(res, {
    trades,
    stats: {
      realizedPnL,
      avgPnl,
      winRate,
      winningTrades,
      losingTrades,
      totalTrades,
    },
    performance: { dailyTrades, monthlyWinningTrades },
  });
});
