import express from "express";
const router = express.Router();

import { validateToken } from "../../middlewares/index.js";

import * as AIConrtoller from "../../controllers/AI/index.js";

router.use(validateToken);

router.post("/sendMessage", AIConrtoller.sendMessage);

export default router;
