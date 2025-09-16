import { reqApi } from "@/lib/axios";

export async function handleGetNotifications() {
  return await reqApi(`/notifications`);
}

export async function handleMarkAsVisited() {
  return await reqApi(`/notifications/visit`, { method: "POST" });
}
