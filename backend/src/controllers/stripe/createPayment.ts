import asyncHandler from "express-async-handler";
import Stripe from "stripe";
import { success, fail } from "../../lib/index.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const createPaymentIntent = asyncHandler(async (req, res) => {
  const { amount } = req.body;

  if (!amount) return fail("Amount is required", 400);

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
    });

    return success(res, { clientSecret: paymentIntent.client_secret });
  } catch (err: any) {
    return fail(err.message, 500);
  }
});
