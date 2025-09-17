import { prisma } from "../lib/index.js";
import { io } from "../socket/index.js";

const notificationService = {
  create(type, title, content, userId) {
    return prisma.notification.create({
      data: { type, title, content, userId },
    });
  },

  createWelcome(userId) {
    return this.create(
      "WELCOME",
      "Welcome to Flash",
      "You have successfully created your account.",
      userId
    );
  },

  createReset(userId) {
    return this.create(
      "SUCCESS",
      "Profile reset",
      "Your profile has been reset. Please buy a stock to start trading.",
      userId
    );
  },

  createWarning(userId, symbol, direction) {
    const title = direction === "profit" ? "Profit Alert!" : "Loss Alert!";
    const content =
      direction === "profit"
        ? `Your trade on ${symbol} has gained 5% or more!`
        : `Your trade on ${symbol} dropped 5% or more.`;

    return this.create("WARNING", title, content, userId);
  },

  async sendToUser(userId) {
    io.to(userId).emit("alert");

    await prisma.user.update({
      where: { id: userId },
      data: { hasNotifications: true, welcomeSent: true },
    });
  },
};

export default notificationService;
