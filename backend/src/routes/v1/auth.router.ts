import express from "express";
const router = express.Router();

import {
  validateToken,
  validate,
  authLimiter,
} from "../../middlewares/index.js";
import {
  signupBodySchema,
  loginBodySchema,
  sendPasscode,
  verifyPasscode,
  resetPassword,
  updatePassword,
} from "../../schemas/index.js";
import * as authController from "../../controllers/auth/index.js";

router.post("/refresh-token", authController.refreshToken);

router.delete("/logout", validateToken, authController.logOut);

router.use(authLimiter);

router.post(
  "/signup",
  validate({ body: signupBodySchema }),
  authController.signUp
);
router.post(
  "/login",
  validate({ body: loginBodySchema }),
  authController.logIn
);

router.post(
  "/reset-password",
  validate({ body: sendPasscode }),
  authController.sendPasscode
);
router.post(
  "/reset-password/verify",
  validate({ body: verifyPasscode }),
  authController.verifyPasscode
);
router.post(
  "/reset-password/reset",
  validate({ body: resetPassword }),
  authController.resetPassword
);
router.post(
  "/update-password",
  validate({ body: updatePassword }),
  validateToken,
  authController.updatePassword
);

export default router;
