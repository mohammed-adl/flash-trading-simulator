"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

import { LoadingScreen } from "@/components/ui";
import { useUser } from "@/contexts";
import { authService } from "@/services";
import { initSocketConnection, socket, disconnectSocket } from "@/socket";

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const router = useRouter();
  const { username } = useParams();

  async function validateToken() {
    try {
      const isExpired = await authService.validateAccessToken();
      if (isExpired) {
        const body = await authService.callRefreshToken();
        console.log("Refreshing token:", body);
        if (body) authService.setTokens(body.token, body.refreshToken);
      }

      if (user?.username && user.username !== username) {
        router.replace(`/${user.username}`);
        return;
      }

      initSocketConnection(user);
    } catch (err) {
      console.error("Error logging in:", err);
      authService.logout();
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!user) return;

    validateToken();

    return () => {
      disconnectSocket();
    };
  }, []);

  useEffect(() => {
    if (!user) return;
    if (!socket.connected) return;

    socket.emit("setWatchlist", { holdings: user.holdings });
  }, [user?.holdings]);

  if (!user) authService.logout();
  if (loading) return <LoadingScreen />;

  return <>{children}</>;
}
