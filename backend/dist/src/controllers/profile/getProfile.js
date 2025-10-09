import asyncHandler from "express-async-handler";
import { success, fail, prisma, userSelect } from "../../lib/index.js";
export const getProfile = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: userSelect,
    });
    if (!user)
        return fail("Profile not found", 404);
    return success(res, { user });
});
//# sourceMappingURL=getProfile.js.map