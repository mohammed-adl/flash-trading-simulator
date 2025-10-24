import { prisma } from "../lib/index.js";
import { io } from "../socket/index.js";
import type { NOTIFICATION_TYPE } from "@prisma/client";

interface WarningData {
  userId: string;
  symbol: string;
  direction: string;
}

const notificationService = {
  create(
    type: NOTIFICATION_TYPE,
    title: string,
    content: string,
    userId: string
  ) {
    return prisma.notification.create({
      data: { type, title, content, userId },
    });
  },

  async createReset(userId: string) {
    await notificationService.create(
      "SUCCESS",
      "Profile reset",
      "Your profile has been reset. Please buy an asset to start trading.",
      userId
    );
    notificationService.sendToUser(userId);
  },

  async createWarning(data: WarningData) {
    const title = data.direction === "profit" ? "Profit Alert!" : "Loss Alert!";
    const content =
      data.direction === "profit"
        ? `Your trade on ${data.symbol} has gained 5% or more!`
        : `Your trade on ${data.symbol} dropped 5% or more.`;

    await notificationService.create("WARNING", title, content, data.userId);
    notificationService.sendToUser(data.userId);
  },

  async sendToUser(userId: string) {
    io!.to(userId).emit("alert");

    await prisma.user.update({
      where: { id: userId },
      data: { hasNotifications: true },
    });
  },
};

export default notificationService;
