import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { AppError } from "../utils/index.js";
import { prisma, redis, sendEmailPasscode, userSelect } from "../lib/index.js";
import { generatePasscode } from "../utils/index.js";
import {
  ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_EXPIRY,
  REFRESH_TOKEN_MAX_AGE,
} from "../config/constants.js";

const ACCESS_SECRET = process.env.ACCESS_SECRET!;
const REFRESH_SECRET = process.env.REFRESH_SECRET!;
const isProd = process.env.NODE_ENV === "production";

// Types
interface CreateUserData {
  email: string;
  password: string;
  name: string;
  username: string;
}

interface JWTPayload {
  id: string;
  [key: string]: any;
}

const authService = {
  // ==============================================
  // User CREATION
  // ==============================================
  async createUser(data: CreateUserData) {
    const userExists = await prisma.user.findUnique({
      where: { email: data.email },
      select: { id: true },
    });

    if (userExists) {
      throw new AppError("User already exists", 400);
    }
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.$transaction(async (prismaTx) => {
      const newUser = await prismaTx.user.create({
        data: {
          email: data.email,
          password: hashedPassword,
          username: data.username,
          hasNotifications: true,
        },
        select: userSelect,
      });

      await prismaTx.notification.create({
        data: {
          type: "WELCOME",
          title: "Welcome to Flash",
          content: "You have successfully created your account.",
          userId: newUser.id,
        },
      });

      return newUser;
    });

    return user;
  },

  // ==============================================
  // AUTHENTICATION
  // ==============================================
  async logIn(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { ...userSelect, password: true },
    });

    if (!user) {
      throw new AppError("Incorrect username or password", 400);
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      throw new AppError("Incorrect username or password", 400);
    }
    delete (user as any).password;
    return user;
  },

  async logOut(userId: string, refreshToken: string): Promise<void> {
    const tokens = await prisma.refreshToken.findMany({
      where: {
        userId,
        expiresAt: { gt: new Date() },
      },
    });

    if (tokens.length === 0) {
      throw new AppError("No refresh token found", 400);
    }

    let validToken: (typeof tokens)[0] | null = null;
    for (const token of tokens) {
      const isValid = await bcrypt.compare(refreshToken, token.token);
      if (isValid) {
        validToken = token;
        break;
      }
    }

    if (!validToken) {
      throw new AppError("Invalid refresh token", 401);
    }

    await prisma.refreshToken.delete({
      where: { id: validToken.id },
    });
  },

  // ==============================================
  // TOKEN HELPERS
  // ==============================================
  async saveRefreshToken(
    userId: string,
    refreshToken: string
  ): Promise<string> {
    const hashedToken = await bcrypt.hash(refreshToken, 10);

    const token = await prisma.refreshToken.create({
      data: {
        userId,
        token: hashedToken,
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_MAX_AGE),
      },
      select: { id: true },
    });

    return token.id;
  },

  async verifyRefreshToken(token: string): Promise<JWTPayload> {
    try {
      const payload = jwt.verify(token, REFRESH_SECRET) as JWTPayload;

      const storedToken = await prisma.refreshToken.findFirst({
        where: {
          userId: payload.id,
          expiresAt: { gt: new Date() },
        },
      });

      if (!storedToken) {
        throw new AppError("Refresh token not found", 401);
      }

      const isValidToken = await bcrypt.compare(token, storedToken.token);
      if (!isValidToken) {
        throw new AppError("Invalid refresh token", 401);
      }

      return payload;
    } catch (err) {
      throw new AppError("Invalid refresh token", 401);
    }
  },

  generateAccessToken(payload: JWTPayload): string {
    return jwt.sign(payload, ACCESS_SECRET, {
      expiresIn: `${ACCESS_TOKEN_EXPIRY}`,
    });
  },

  generateRefreshToken(payload: JWTPayload): string {
    return jwt.sign(payload, REFRESH_SECRET, {
      expiresIn: `${REFRESH_TOKEN_EXPIRY}`,
    });
  },

  // ==============================================
  // PASSWORD RECOVERY
  // ==============================================
  async sendPasscode(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new AppError("Email not found", 404);
    }

    const passcode = generatePasscode();
    const select = isProd ? { email: true } : { email: true, passcode: true };

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        passcode: passcode,
        passcodeExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
      select,
    });

    await sendEmailPasscode({ email: updatedUser.email, passcode: passcode });
    return updatedUser;
  },

  async verifyPasscode(email: string, passcode: string): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { email: true, passcode: true, passcodeExpiresAt: true },
    });

    if (!user) {
      throw new AppError("Email not found", 404);
    }
    if (user.passcode !== passcode) {
      throw new AppError("Invalid passcode", 400);
    }
    if (!user.passcodeExpiresAt || user.passcodeExpiresAt < new Date()) {
      throw new AppError("Passcode expired", 400);
    }
  },

  async resetPassword(email: string, newPassword: string): Promise<void> {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new AppError("Email not found", 404);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      throw new AppError("You entered old password", 400);
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passcode: null,
        passcodeExpiresAt: null,
      },
    });
  },

  async updatePassword(req, newPassword: string): Promise<void> {
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { password: true },
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    const isOldPassword = await bcrypt.compare(newPassword, user.password);

    if (isOldPassword) {
      throw new AppError("You can't choose the same old password", 400);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
  },
};

export default authService;
