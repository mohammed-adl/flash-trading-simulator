import express from "express";
const router = express.Router();

import { validateToken, validate } from "../../middlewares/index.js";
import {
  symbolSchema,
  sellAssetBodySchema,
} from "../../schemas/index.js";
import * as stockController from "../../controllers/asset/index.js";

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
  validate({ params: symbolSchema, body: sellAssetBodySchema }),
  stockController.sellStock
);

export default router;
