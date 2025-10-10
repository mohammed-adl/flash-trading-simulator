import { redis } from "../lib/index.js";
// ------------------ Redis Keys ------------------
const KEYS = {
    transactions: (userId) => `user:${userId}:transactions`,
    monthlyRealizedPnL: (userId) => `user:${userId}:monthlyRealizedPnL`,
    tradeStats: (userId) => `user:${userId}:tradeStats`,
    positions: (userId) => `user:${userId}:positions`,
    dailyTrades: (userId) => `user:${userId}:dailyTrades`,
    monthlyWinningTrades: (userId) => `user:${userId}:monthlyWinningTrades`,
};
// ------------------ Redis Service ------------------
const redisService = {
    // ------------------ Core Helpers ------------------
    set: async (key, value, expireSeconds) => {
        const data = typeof value === "string" ? value : JSON.stringify(value);
        if (expireSeconds)
            await redis.setex(key, expireSeconds, data);
        else
            await redis.set(key, data);
    },
    get: async (key) => {
        const data = await redis.get(key);
        if (!data)
            return null;
        try {
            return JSON.parse(data);
        }
        catch {
            return data;
        }
    },
    del: async (key) => {
        await redis.del(key);
    },
    incrBy: async (key, amount = 1) => {
        return await redis.incrby(key, amount);
    },
    exists: async (key) => {
        return (await redis.exists(key)) === 1;
    },
    // ------------------ Helper Getters ------------------
    getTransactions: async (userId) => {
        return (await redisService.get(KEYS.transactions(userId))) || { totalDeposits: 0, totalWithdrawals: 0 };
    },
    getMonthlyRealizedPnL: async (userId) => {
        return (await redisService.get(KEYS.monthlyRealizedPnL(userId))) || {};
    },
    getTradeStats: async (userId) => {
        return ((await redisService.get(KEYS.tradeStats(userId))) || {
            totalTrades: 0,
            winningTrades: 0,
            losingTrades: 0,
            realizedPnL: 0,
            avgPnl: 0,
            largestWin: 0,
            largestLoss: 0,
            avgWin: 0,
            avgLoss: 0,
            winRate: 0,
            lastTrade: null,
            totalSharesTraded: 0,
            lastUpdated: null,
        });
    },
    getPositions: async (userId) => {
        return (await redisService.get(KEYS.positions(userId))) || {};
    },
    getDailyTrades: async (userId) => {
        return (await redisService.get(KEYS.dailyTrades(userId))) || {};
    },
    getMonthlyWinningTrades: async (userId) => {
        return (await redisService.get(KEYS.monthlyWinningTrades(userId))) || {};
    },
    // ------------------ High-Level Functions ------------------
    setPositions: async (userId, symbol, positionData) => {
        const key = KEYS.positions(userId);
        let positions = await redisService.getPositions(userId);
        if (positionData === null) {
            delete positions[symbol];
        }
        else {
            positions[symbol] = positionData;
        }
        await redisService.set(key, positions);
        return positions;
    },
    setStats: async (userId, trade) => {
        const key = KEYS.tradeStats(userId);
        let stats = await redisService.getTradeStats(userId);
        const profit = Number(trade.profit ?? 0);
        stats.totalTrades += 1;
        stats.realizedPnL += profit;
        stats.totalSharesTraded += Number(trade.quantity);
        if (profit > 0) {
            stats.winningTrades += 1;
            stats.avgWin = (stats.avgWin * (stats.winningTrades - 1) + profit) / stats.winningTrades;
            if (profit > stats.largestWin)
                stats.largestWin = profit;
        }
        else {
            stats.losingTrades += 1;
            stats.avgLoss = (stats.avgLoss * (stats.losingTrades - 1) + profit) / stats.losingTrades;
            if (profit < stats.largestLoss)
                stats.largestLoss = profit;
        }
        stats.winRate = (stats.winningTrades / stats.totalTrades) * 100;
        stats.avgPnl = stats.realizedPnL / stats.totalTrades;
        stats.lastTrade = {
            id: trade.id,
            symbol: trade.symbol,
            action: trade.type,
            shares: trade.quantity,
            profit,
            date: trade.createdAt,
        };
        stats.lastUpdated = new Date().toISOString();
        await redisService.set(key, stats);
        return stats;
    },
    setMonthlyPnL: async (userId, profit) => {
        const key = KEYS.monthlyRealizedPnL(userId);
        const monthKey = new Date().toISOString().slice(0, 7);
        let monthlyPnL = await redisService.getMonthlyRealizedPnL(userId);
        monthlyPnL[monthKey] = (monthlyPnL[monthKey] || 0) + Number(profit ?? 0);
        await redisService.set(key, monthlyPnL);
        return monthlyPnL;
    },
    setTransactions: async (userId, amount, type) => {
        const key = KEYS.transactions(userId);
        let transactions = await redisService.getTransactions(userId);
        if (type === "DEPOSIT")
            transactions.totalDeposits += amount;
        else if (type === "WITHDRAWAL")
            transactions.totalWithdrawals += amount;
        await redisService.set(key, transactions);
        return transactions;
    },
    setDailyTrades: async (userId, day, tradesCount) => {
        const key = KEYS.dailyTrades(userId);
        let dailyTrades = await redisService.getDailyTrades(userId);
        dailyTrades[day] = (dailyTrades[day] || 0) + tradesCount;
        const last7Days = Object.keys(dailyTrades)
            .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
            .slice(-7)
            .reduce((acc, k) => {
            acc[k] = dailyTrades[k];
            return acc;
        }, {});
        await redisService.set(key, last7Days);
        return last7Days;
    },
    setMonthlyWinningTrades: async (userId, trade) => {
        if (trade.profit <= 0)
            return;
        const key = KEYS.monthlyWinningTrades(userId);
        const monthKey = new Date(trade.createdAt).toISOString().slice(0, 7);
        let monthlyWins = await redisService.getMonthlyWinningTrades(userId);
        monthlyWins[monthKey] = (monthlyWins[monthKey] || 0) + 1;
        await redisService.set(key, monthlyWins);
        return monthlyWins;
    },
};
export default redisService;
//# sourceMappingURL=redis.service.js.map