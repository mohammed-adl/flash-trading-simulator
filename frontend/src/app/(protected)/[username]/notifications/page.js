"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useUser } from "@/contexts";
import { Logo, Spinner } from "@/components/ui";

import { handleGetNotifications } from "@/fetchers";
import { formatTimeShort } from "@/utils";
import { getNotificationIcon } from "@/utils/notificationIcons";

export default function NotificationsPage() {
  const { user } = useUser();
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  async function getAllNotifications() {
    setLoading(true);
    try {
      const body = await handleGetNotifications();
      setNotifications(body.notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getAllNotifications();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="flex items-center gap-2 pb-4 mb-6 border-b border-border">
        <Logo
          className="w-8 h-8 cursor-pointer"
          onClick={() => router.push(`/${user.username}`)}
        />
        <h1 className="text-xl font-semibold">Notifications</h1>
      </div>

      <div className="flex flex-col space-y-3">
        {loading ? (
          <div className="flex justify-center py-6">
            <Spinner className="w-6 h-6" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-muted text-center py-6 text-sm">
            No notifications
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className="flex items-start gap-3 p-4 rounded-lg hover:bg-[#1a1a1a] transition-colors duration-150 border border-border"
            >
              <div className="flex-shrink-0 mt-1">
                {getNotificationIcon(n.type)}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <span className="font-medium">{n.title}</span>
                  <span className="text-xs text-muted">
                    {formatTimeShort(n.createdAt)}
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted">{n.content}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
