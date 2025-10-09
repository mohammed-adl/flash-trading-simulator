import express from "express";
const router = express.Router();
import { validateToken } from "../../middlewares/index.js";
import * as portfolioController from "../../controllers/portfolio/index.js";
router.use(validateToken);
router.get("/", portfolioController.getPortfolio);
router.get("/trades", portfolioController.getTrades);
export default router;
//# sourceMappingURL=portfolio.router.js.map