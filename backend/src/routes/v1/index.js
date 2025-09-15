// import profileRouter from "./profile.router.js";
// import searchRouter from "./search.router.js";
// import stockRouter from "./stock.router.js";
// import transactionRouter from "./transaction.router.js";
// import notificationRouter from "./notification.router.js";
// import PortfolioRouter from "./portfolio.router.js";
import authRouter from "./auth.router.js";

export function setupRoutes(app) {
  app.use("/api/v1/auth", authRouter);
  // app.use("/api/v1/profiles", profileRouter);
  // app.use("/api/v1/search", searchRouter);
  // app.use("/api/v1/stocks", stockRouter);
  // app.use("/api/v1/transactions", transactionRouter);
  // app.use("/api/v1/notifications", notificationRouter);
  // app.use("/api/v1/portfolio", PortfolioRouter);
}
