import express from "express";
const router = express.Router();
import * as stripeController from "../../controllers/stripe/index.js";
router.post("/create-payment", stripeController.createPaymentIntent);
export default router;
//# sourceMappingURL=stripe.routes.js.map