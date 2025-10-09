import { validateBodyToken } from "../middlewares/index.js";
function setupAuthMiddleware(socket, next) {
    const { token } = socket.handshake.auth;
    try {
        const userId = validateBodyToken(token);
        if (!userId) {
            return next(new Error("Unauthorized"));
        }
        socket.userId = userId;
        next();
    }
    catch (err) {
        next(new Error("Unauthorized"));
    }
}
export default setupAuthMiddleware;
//# sourceMappingURL=socketMiddleware.js.map