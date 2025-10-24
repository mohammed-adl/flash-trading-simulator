import asyncHandler from "express-async-handler";

import {
  success,
  fail,
  prisma,
  fetchPrice,
  userSelect,
  tradeSelect,
} from "../../lib/index.js";
import { redisService } from "../../services/index.js";

export const buyStock = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const symbol = req.params.symbol;
  const { quantity } = req.body;

  const stockData = await fetchPrice(symbol);
  const currentPrice = stockData.price || 0;
  const stockName = stockData.name || "";

  const userBalance = await prisma.user.findUnique({
    where: { id: userId },
    select: { balance: true },
  });

  const totalCost = currentPrice * quantity;
  if (Number(totalCost) > Number(userBalance!.balance))
    return fail("Insufficient balance", 400);

  const result = await prisma.$transaction(async (tx) => {
    const holdingExist = await tx.holding.findUnique({
      where: { userId_symbol: { userId: userId, symbol } },
      select: { quantity: true, avgPrice: true },
    });

    let newHoldingData: any;
    if (!holdingExist) {
      newHoldingData = {
        quantity,
        avgPrice: currentPrice,
      };
    } else {
      const existingQty = Number(holdingExist.quantity);
      const newAvgPrice =
        (Number(holdingExist.avgPrice) * existingQty +
          currentPrice * quantity) /
        (existingQty + quantity);

      newHoldingData = {
        quantity: existingQty + quantity,
        avgPrice: newAvgPrice,
      };
    }

    const holding = await tx.holding.upsert({
      where: { userId_symbol: { userId: userId, symbol } },
      create: {
        userId: userId,
        symbol,
        name: stockName,
        quantity: newHoldingData.quantity,
        avgPrice: newHoldingData.avgPrice,
      },
      update: {
        quantity: newHoldingData.quantity,
        avgPrice: newHoldingData.avgPrice,
      },
    });

    const user = await tx.user.update({
      where: { id: userId },
      data: {
        balance: { decrement: totalCost },
      },
      select: userSelect,
    });

    const trade = await tx.trade.create({
      data: {
        symbol,
        type: "BUY",
        name: stockName,
        quantity,
        price: currentPrice,
        userId: userId,
      },
      select: tradeSelect,
    });

    return { user, trade, holding };
  });

  await redisService.setPositions(userId, symbol, {
    symbol,
    name: result.holding.name,
    quantity: result.holding.quantity,
    avgPrice: result.holding.avgPrice,
  });

  return success(res, {
    user: result.user,
    holding: result.holding,
    trade: result.trade,
  });
});
