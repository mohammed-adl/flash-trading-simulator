import express from "express";
const router = express.Router();

import { validateToken } from "../../middlewares/index.js";
import { validate } from "../../middlewares/index.js";
import { depositBodySchema, withdrawBodySchema } from "../../schemas/index.js";
import * as transactionController from "../../controllers/transaction/index.js";

router.use(validateToken);

router.post(
  "/deposit",
  validate({ body: depositBodySchema }),
  transactionController.deposit
);
router.post(
  "/withdraw",
  validate({ body: withdrawBodySchema }),
  transactionController.withdraw
);

export default router;
