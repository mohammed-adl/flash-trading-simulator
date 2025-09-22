import { jwtDecode } from "jwt-decode";
import { socket } from "@/socket";
import { handleRefreshToken } from "../fetchers";

const authService = {
  setToken: (token) => {
    localStorage.setItem("token", token);
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
      const data = await handleRefreshToken();
      return data;
    } catch (err) {
      authService.logout();
      throw err;
    }
  },

  clearSession: () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    socket.disconnect();
  },

  logout: () => {
    authService.clearSession();
    window.location.href = "/";
  },
};

export default authService;
