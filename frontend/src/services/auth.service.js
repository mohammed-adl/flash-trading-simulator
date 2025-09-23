import { jwtDecode } from "jwt-decode";
import { socket } from "@/socket";
import { handleRefreshToken } from "../fetchers";

const authService = {
  setTokens: (token, refreshToken) => {
    localStorage.setItem("token", token);
    localStorage.setItem("refreshToken", refreshToken);
    return token;
  },

  validateAccessToken: async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      authService.logout();
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const currentTime = new Date().getTime() / 1000;
      return decoded.exp < currentTime;
    } catch {
      authService.logout();
    }
  },

  callRefreshToken: async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        authService.logout();
        return;
      }
      const data = await handleRefreshToken(refreshToken);
      return data;
    } catch (err) {
      authService.logout();
      throw err;
    }
  },

  clearSession: () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    socket.disconnect();
  },

  logout: () => {
    authService.clearSession();
    window.location.href = "/";
  },
};

export default authService;
