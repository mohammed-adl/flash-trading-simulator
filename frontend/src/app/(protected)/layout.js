"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

import { LoadingScreen } from "@/components/ui";
import { useUser } from "@/contexts";
import { authService } from "@/services";
import { initSocketConnection, disconnectSocket } from "@/socket";

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const router = useRouter();
  const { username } = useParams();

  const validateToken = async () => {
    try {
      const isExpired = await authService.validateAccessToken();
      if (isExpired) {
        const body = await authService.callRefreshToken();
        if (body) authService.setToken(body.token);
      }

      if (user?.username && user.username !== username) {
        router.replace(`/${user.username}`);
        return;
      }

      initSocketConnection(user);
    } catch (err) {
      authService.logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    validateToken();
    return () => disconnectSocket();
  }, [validateToken]);

  if (loading) return <LoadingScreen />;
  if (!user) authService.logout();

  return <>{children}</>;
}
