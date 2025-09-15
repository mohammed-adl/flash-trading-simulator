import express from "express";
const router = express.Router();
import { validateToken } from "../../middlewares/index.js";
import * as profileController from "../../controllers/profile/index.js";

router.use(validateToken);

router.get("/", profileController.getProfile);
router.put("/reset", profileController.resetProfile);

export default router;
