import express from "express";
const router = express.Router();
import { validateToken } from "../../middlewares/index.js";
import * as searchConrtoller from "../../controllers/search/index.js";
router.use(validateToken);
router.get("/", searchConrtoller.searchAssets);
export default router;
//# sourceMappingURL=search.router.js.map