"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  CircleUserRound,
  BriefcaseBusiness,
  Settings,
  LogOut,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { authService } from "@/services";
import { useUser } from "@/contexts/UserContext";
import { handleLogOut } from "@/fetchers";

export default function UserMenu() {
  const { user } = useUser();
  const { username, email } = user;
  const [open, setOpen] = useState(false);

  const router = useRouter();
  const ref = useRef(null);

  async function logout() {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      await handleLogOut(refreshToken);
      await authService.logout();
    } catch (error) {
      console.error("Logout error:", error.message);
    }
  }

  useEffect(() => {
    function onDocClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return (
    <div className="relative flex items-center" ref={ref}>
      <button onClick={() => setOpen((v) => !v)} className="cursor-pointer">
        <CircleUserRound className="w-7 h-7 text-muted" />
      </button>

      {open && (
        <div className="absolute top-8 right-0 mt-2 w-56 bg-card border border-border rounded-xl shadow-lg z-50 overflow-hidden">
          <div className="px-3 py-3">
            <div className="text-sm font-semibold text-muted mb-0.5">
              {username ?? "Unknown User"}
            </div>
            <div className="text-xs text-primary">{email}</div>
          </div>

          <hr className="border-border" />

          <ul>
            <li
              className="flex items-center gap-1 cursor-pointer hover:bg-border/60 px-3 py-2 text-sm"
              onClick={() => router.push(`/${username}/portfolio`)}
            >
              <BriefcaseBusiness className="w-4 h-4 mr-1 opacity-50" />
              Portfolio
            </li>
            <li
              className="flex items-center gap-1 cursor-pointer hover:bg-border/60 px-3 py-2 text-sm"
              onClick={() => router.push(`/${username}/settings`)}
            >
              <Settings className="w-4 h-4 mr-1 opacity-50" />
              Settings
            </li>
            <li
              onClick={logout}
              className="flex items-center gap-1 cursor-pointer hover:bg-border/60 px-3 py-2 text-sm"
            >
              <LogOut className="w-4 h-4 mr-1 opacity-50" />
              Logout
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
