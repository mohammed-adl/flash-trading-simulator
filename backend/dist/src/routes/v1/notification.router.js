import express from "express";
const router = express.Router();
import { validateToken } from "../../middlewares/index.js";
import * as notificationController from "../../controllers/notification/index.js";
router.use(validateToken);
router.get("/", notificationController.getNotifications);
router.post("/visit", notificationController.markAsVisited);
export default router;
//# sourceMappingURL=notification.router.js.map