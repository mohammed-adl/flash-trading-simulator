import { validateBodyToken } from "../middlewares/index.js";

function setupAuthMiddleware(socket, next) {
  const { token } = socket.handshake.auth;

  if (!token) {
    return next(new Error("Unauthorized"));
  }

  try {
    const userId = validateBodyToken(token);
    if (!userId) {
      socket.emit("refreshTokenRequired");
      return;
    }

    socket.userId = userId;

    next();
  } catch (err) {
    next(new Error("Unauthorized"));
  }
}

export default setupAuthMiddleware;
