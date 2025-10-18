import { z } from "zod";

const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

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
      .max(100, { message: "Email can't be more than 100 characters long" })
      .email({ message: "Invalid email address" }),
    password: z.string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(100, { message: "Password can't be more than 100 characters long" })
    .regex(passwordRegex, {
      message:
        "Password must be at least 8 characters long, include one uppercase letter and one number",
    }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export const loginBodySchema = z.object({
  email: z
    .string()
    .max(100, { message: "Email can't be more than 100 characters long" })
    .email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password can't be empty" }),
});

export const sendPasscode = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, { message: "Email is required" })
    .max(254, { message: "Email must be less than 255 characters" })
    .email({ message: "Invalid email address" }),
});

export const verifyPasscode = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, { message: "Email is required" })
    .max(254, { message: "Email must be less than 255 characters" })
    .email({ message: "Valid email required" }),
  passcode: z
    .string()
    .trim()
    .length(6, { message: "Passcode must be 6 digits" })
    .regex(/^[0-9]{6}$/, { message: "Passcode must contain only numbers" }),
});

export const resetPassword = z
  .object({
    email: z
      .string()
      .trim()
      .toLowerCase()
      .min(1, { message: "Email is required" })
      .max(254, { message: "Email must be less than 255 characters" })
      .email({ message: "Valid email required" }),
    passcode: z
      .string()
      .trim()
      .length(6, { message: "Passcode must be 6 digits" })
      .regex(/^[0-9]{6}$/, { message: "Passcode must contain only numbers" }),
    newPassword: z
      .string()
      .trim()
      .min(8, { message: "Password must be at least 8 characters long" })
      .max(100, { message: "Password can't be more than 100 characters long" })
      .regex(passwordRegex, {
        message:
          "Password must be at least 8 characters long, include one uppercase letter and one number",
      }),
    confirmPassword: z
      .string()
      .trim()
      .min(8, {
        message: "Confirm password must be at least 8 characters long",
      })
      .max(100, {
        message: "Confirm password can't be more than 100 characters long",
      }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export const updatePassword = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, { message: "Email is required" })
    .max(254, { message: "Email must be less than 255 characters" })
    .email({ message: "Valid email required" }),
  newPassword: z
    .string()
    .trim()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(100, { message: "Password can't be more than 100 characters long" })
    .regex(passwordRegex, {
      message:
        "Password must be at least 8 characters long, include one uppercase letter and one number",
    }),
});
