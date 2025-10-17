import asyncHandler from "express-async-handler";
import OpenAI from "openai";
import { success, fail } from "../../lib/index.js";
import { redisService } from "../../services/index.js";
import { stockCache } from "../../socket/index.js";
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});
const SYSTEM_PROMPT = `You are an assistant in a trading simulator app called Flash.
The user has positions in various stocks with their quantities, average prices to determine profits, and current prices.
You can answer questions about their positions, provide insights, and help with trading decisions.
Only use the position data provided in each message - do not make up or assume prices.
Keep responses concise and helpful. - Do not mention the word average price instead keep it user friendly.`;
export const sendMessage = asyncHandler(async (req, res) => {
    const { message, convo = [] } = req.body;
    const userId = req.user.id;
    if (!message)
        return fail("Message is required", 400);
    const userPositions = await redisService.getPositions(userId);
    const positionsData = Object.entries(userPositions)
        .map(([symbol, data]) => {
        return `${symbol}: ${data.quantity} shares at average price $${data.avgPrice}`;
    })
        .join("\n");
    const positionsText = positionsData || "No positions currently held.";
    const marketPrices = Array.from(stockCache.entries())
        .map(([symbol, data]) => `${symbol} (${data.name}): $${data.price}`)
        .join("\n");
    const marketPricesText = marketPrices || "No market data available.";
    const messages = [
        { role: "system", content: SYSTEM_PROMPT },
        ...convo,
        {
            role: "user",
            content: `Current Positions:\n${positionsText}\n\nMarket Prices:\n${marketPricesText}\n\nUser: ${message}`,
        },
    ];
    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages,
        temperature: 0.7,
        max_tokens: 500,
    });
    const AIReply = completion.choices[0]?.message?.content?.trim() ||
        "Something went wrong. Please try again.";
    return success(res, {
        reply: AIReply,
    });
});
//# sourceMappingURL=sendMessage.js.map