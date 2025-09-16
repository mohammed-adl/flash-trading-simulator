import { socket } from "@/socket";
import { authService } from "@/services";

export const initSocketConnection = (user) => {
  try {
    console.log("Initializing socket connection...");
    const token = localStorage.getItem("token");

    if (!token) {
      authService.logout();
      return;
    }

    socket.auth.token = token;

    socket.connect();

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);

      if (user?.holdings) {
        console.log("Emitting setWatchlist:", user.holdings);
        socket.emit("setWatchlist", { holdings: user.holdings });
      }
    });

    socket.on("refreshTokenRequired", async () => {
      try {
        const body = await authService.callRefreshToken();
        authService.setToken(body.token);

        socket.auth.token = body.token;
        socket.disconnect();
        socket.connect();

        socket.on("disconnect", (reason) =>
          console.log("Socket disconnected:", reason)
        );

        if (user?.holdings) {
          socket.emit("setWatchlist", { holdings: user.holdings });
        }
      } catch (err) {
        console.log("Error refreshing token:", err);
      }
    });

    socket.on("logout", () => authService.logout());
  } catch (err) {
    console.error("Error initializing socket:", err);
    authService.logout();
  }
};

export const disconnectSocket = () => {
  socket.off("logout");
  socket.off("refreshTokenRequired");
  socket.disconnect();
};
