import { z } from "zod";

const passwordRegex = /^(?=.*[A-Z]).+$/;

export const signupBodySchema = z
  .object({
    username: z
      .string()
      .min(3, { message: "Username must be at least 3 characters long" })
      .max(30, { message: "Username can't be more than 30 characters long" })
      .regex(/^[a-zA-Z0-9_]+$/, {
        message: "Username can only contain letters, numbers, and underscores",
      }),

    email: z
      .string()
      .email({ message: "Invalid email address" })
      .max(100, { message: "Email can't be more than 100 characters long" }),

    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" })
      .max(100, { message: "Password can't be more than 100 characters long" })
      .regex(passwordRegex, {
        message: "Password must include at least one uppercase letter",
      }),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export const loginBodySchema = z.object({
  email: z
    .email({ message: "Invalid email address" })
    .max(100, { message: "Email can't be more than 100 characters long" }),

  password: z.string().min(1, { message: "Password can't be empty" }),
});

export const resetPasswordBodySchema = z
  .object({
    newPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" })
      .max(100, { message: "Password can't be more than 100 characters long" })
      .regex(passwordRegex, {
        message: "Password must include at least one uppercase letter",
      }),

    confirmPassword: z
      .string()
      .min(8, {
        message: "Confirm password must be at least 8 characters long",
      })
      .max(100, {
        message: "Confirm password can't be more than 100 characters long",
      }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
