import { socket } from "@/lib";
import { authService } from "@/services";

export const initSocketConnection = (user) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      authService.logout();
      return;
    }

    socket.auth.token = token;
    socket.connect();

    if (user?.holdings) {
      socket.emit("setWatchlist", { holdings: user.holdings });
    }

    socket.on("refreshTokenRequired", async () => {
      try {
        const body = await authService.callRefreshToken();
        authService.setToken(body.token);

        socket.auth.token = body.token;
        socket.disconnect();
        socket.connect();

        // if (user?.holdings) {
        //   socket.emit("setWatchlist", { holdings: user.holdings });
        // }
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
