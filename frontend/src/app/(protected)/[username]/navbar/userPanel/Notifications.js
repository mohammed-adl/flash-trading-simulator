"use client";
import { useState, useEffect, useRef } from "react";
import { Bell } from "lucide-react";
import { useRouter } from "next/navigation";

import { useUser, useNotification } from "@/contexts";
import { Spinner } from "@/components/ui";
import { handleGetNotifications, handleMarkAsVisited } from "@/fetchers";
import { formatTimeShort, getNotificationIcon } from "@/utils";

export default function Notifications() {
  const { setUser, user } = useUser();
  const { hasNotifications, setHasNotifications } = useNotification();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();

  async function getNotifications() {
    setLoading(true);
    try {
      const data = await handleMarkAsVisited();
      setUser(data.user);
      setHasNotifications(false);
      const body = await handleGetNotifications();
      setNotifications(body.notifications);
      setOpen(true);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div className="relative z-50" ref={dropdownRef}>
      <button
        className="p-1 hover:bg-accent rounded-md relative mt-1"
        onClick={getNotifications}
      >
        <Bell className="w-6 h-6 cursor-pointer" />
        {hasNotifications && (
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-1 z-50">
          <div className="absolute -top-2 right-3 w-2 h-2 bg-card border-l border-t border-border rotate-45"></div>
          <div className="mt-1 w-80 bg-card shadow-xl rounded-xl border border-border max-h-96 overflow-y-auto flex flex-col">
            {loading ? (
              <div className="flex justify-center p-3">
                <Spinner className="w-5 h-5 " />
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-3 text-muted text-center text-sm">
                No notifications
              </div>
            ) : (
              <div className="flex flex-col divide-y divide-border">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className="flex items-center gap-3 p-3 hover:bg-[#1a1a1a] transition-colors duration-150 cursor-pointer"
                  >
                    <div className="flex items-center flex-shrink-0">
                      {getNotificationIcon(n.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="mb-1 font-semibold text-foreground text-sm">
                          {n.title}
                        </div>
                        <span className="text-xs text-muted">
                          {formatTimeShort(n.createdAt)}
                        </span>
                      </div>
                      <div className="mt-0.5 text-xs text-muted">
                        {n.content}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {!loading && notifications.length > 0 && (
              <button
                onClick={() => router.push(`/${user?.username}/notifications`)}
                className="w-full text-center text-sm p-2 hover:bg-[#1a1a1a] text-primary border-t border-border cursor-pointer"
              >
                See all notifications
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
