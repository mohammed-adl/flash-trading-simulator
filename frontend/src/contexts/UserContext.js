"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { authService } from "@/services";
import { LoadingScreen } from "@/components/ui";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      authService.clearSession();
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    function handleStorageChange(event) {
      if (
        (event.key === "user" && event.newValue === null) ||
        (event.key === "token" && event.newValue === null)
      ) {
        authService.logout();
      }
    }

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  if (loading) return <LoadingScreen />;

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
