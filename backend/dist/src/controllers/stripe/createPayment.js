import asyncHandler from "express-async-handler";
import Stripe from "stripe";
import { success, fail } from "../../lib/index.js";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
export const createPaymentIntent = asyncHandler(async (req, res) => {
    const { amount } = req.body;
    if (!amount)
        return fail("Amount is required", 400);
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: "usd",
            automatic_payment_methods: { enabled: true },
        });
        return success(res, { clientSecret: paymentIntent.client_secret });
    }
    catch (err) {
        console.error(err);
        return fail(err.message, 500);
    }
});
//# sourceMappingURL=createPayment.js.map