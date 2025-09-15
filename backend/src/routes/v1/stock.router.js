import express from "express";
const router = express.Router();

import { validateToken, validate } from "../../middlewares/index.js";
import {
  symbolSchema,
  buyStockBodySchema,
  sellStockBodySchema,
} from "../../schemas/index.js";
import * as stockController from "../../controllers/stock/index.js";

router.use(validateToken);

router.get(
  "/:symbol",
  validate({ params: symbolSchema }),
  stockController.getStock
);
router.get(
  "/:symbol/price",
  validate({ params: symbolSchema }),
  stockController.getPrice
);

router.post("/:symbol/buy", stockController.buyStock);
router.post(
  "/:symbol/sell",
  validate({ params: symbolSchema, body: sellStockBodySchema }),
  stockController.sellStock
);

export default router;
