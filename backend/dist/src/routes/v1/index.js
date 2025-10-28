import profileRouter from "./profile.router.js";
import searchRouter from "./search.router.js";
import assetRouter from "./asset.router.js";
import transactionRouter from "./transaction.router.js";
import notificationRouter from "./notification.router.js";
import PortfolioRouter from "./portfolio.router.js";
import authRouter from "./auth.router.js";
import AIRouter from "./AI.router.js";
import stripeRouter from "./stripe.routes.js";
export function setupRoutes(app) {
    app.use("/api/v1/auth", authRouter);
    app.use("/api/v1/profiles", profileRouter);
    app.use("/api/v1/search", searchRouter);
    app.use("/api/v1/assets", assetRouter);
    app.use("/api/v1/transactions", transactionRouter);
    app.use("/api/v1/notifications", notificationRouter);
    app.use("/api/v1/portfolio", PortfolioRouter);
    app.use("/api/v1/AI", AIRouter);
    app.use("/api/v1/stripe", stripeRouter);
}
//# sourceMappingURL=index.js.map