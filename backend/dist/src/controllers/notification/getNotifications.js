import asyncHandler from "express-async-handler";
import { success, prisma } from "../../lib/index.js";
export const getNotifications = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const NOTIFCATIOBS_LIMIT = 3;
    const notifications = await prisma.notification.findMany({
        where: {
            userId,
        },
        orderBy: {
            createdAt: "desc",
        },
        take: NOTIFCATIOBS_LIMIT,
    });
    return success(res, { notifications });
});
//# sourceMappingURL=getNotifications.js.map