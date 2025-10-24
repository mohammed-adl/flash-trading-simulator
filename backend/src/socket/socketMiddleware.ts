import { Socket } from "socket.io";
import { validateBodyToken } from "../middlewares/index.js";

function setupAuthMiddleware(socket: Socket, next: (err?: Error) => void) {
  const { token } = socket.handshake.auth;

  try {
    const userId = validateBodyToken(token);
    if (!userId) {
      return next(new Error("Unauthorized"));
    }

    socket.userId = userId;

    next();
  } catch (err) {
    next(new Error("Unauthorized"));
  }
}

export default setupAuthMiddleware;
