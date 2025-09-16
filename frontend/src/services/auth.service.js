import { jwtDecode } from "jwt-decode";
import { socket } from "@/socket";

import { handleRefreshToken } from "../fetchers";

const authService = {
  setToken(token) {
    localStorage.setItem("token", token);
    return token;
  },

  async validateAccessToken() {
    const token = localStorage.getItem("token");
    if (!token) {
      this.logout();
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const currentTime = new Date().getTime() / 1000;
      if (decoded.exp < currentTime) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      this.logout();
    }
  },

  async callRefreshToken() {
    try {
      const data = await handleRefreshToken();
      return data;
    } catch (err) {
      this.logout();
    }
  },

  clearSession() {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    socket.disconnect();
  },

  logout() {
    this.clearSession();
    window.location.href = "/";
  },
};

export default authService;
