"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { socket } from "../socket";
import { useUser } from "../contexts";

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const { user } = useUser();
  const [hasNotifications, setHasNotifications] = useState(
    user?.hasNotifications
  );

  useEffect(() => {
    if (!socket?.on) return;

    const handleAlert = () => {
      setHasNotifications(true);
      console.log("Notification received");
    };

    socket.on("alert", handleAlert);

    return () => {
      socket.off("alert", handleAlert);
    };
  }, [socket]);

  return (
    <NotificationContext.Provider
      value={{ hasNotifications, setHasNotifications }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  return useContext(NotificationContext);
}
