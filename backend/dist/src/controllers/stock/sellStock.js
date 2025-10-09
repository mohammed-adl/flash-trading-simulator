import asyncHandler from "express-async-handler";
import { success, fail, prisma, fetchPrice, userSelect, tradeSelect, } from "../../lib/index.js";
import { redisService } from "../../services/index.js";
export const sellStock = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { symbol } = req.params;
    const { quantity } = req.body;
    const stockData = await fetchPrice(symbol);
    const currentPrice = stockData.price;
    const stockName = stockData.name;
    const result = await prisma.$transaction(async (tx) => {
        const holding = await tx.holding.findUnique({
            where: { userId_symbol: { userId: userId, symbol } },
            select: { quantity: true, avgPrice: true, name: true },
        });
        if (!holding)
            return fail("You don't own the stock", 400);
        const existingQty = Number(holding.quantity);
        if (quantity > existingQty)
            throw new fail("Cannot sell more than you own", 400);
        const profits = (currentPrice - holding.avgPrice) * quantity;
        const totalGain = currentPrice * quantity;
        let remainingQty = existingQty - quantity;
        if (remainingQty === 0) {
            await tx.holding.delete({
                where: { userId_symbol: { userId: userId, symbol } },
            });
        }
        else {
            await tx.holding.update({
                where: { userId_symbol: { userId: userId, symbol } },
                data: {
                    quantity: remainingQty,
                    avgPrice: holding.avgPrice,
                },
            });
        }
        const user = await tx.user.update({
            where: { id: userId },
            data: {
                balance: { increment: totalGain },
                profits: { increment: profits },
            },
            select: userSelect,
        });
        const trade = await tx.trade.create({
            data: {
                symbol,
                name: stockName,
                type: "SELL",
                profit: profits,
                quantity,
                price: currentPrice,
                userId: userId,
            },
            select: tradeSelect,
        });
        return {
            user,
            trade,
            holding: { ...holding, quantity: remainingQty },
            profits,
        };
    });
    await redisService.setPositions(userId, symbol, result.holding.quantity === 0
        ? null
        : {
            symbol,
            name: result.holding.name,
            quantity: result.holding.quantity,
            avgPrice: result.holding.avgPrice,
        });
    await redisService.setMonthlyPnL(userId, result.profits);
    await redisService.setStats(userId, result.trade);
    await redisService.setDailyTrades(userId, new Date().toISOString().slice(0, 10), 1);
    await redisService.setMonthlyWinningTrades(userId, result.trade);
    return success(res, {
        user: result.user,
        holding: result.holding,
        trade: result.trade,
    });
});
//# sourceMappingURL=sellStock.js.map