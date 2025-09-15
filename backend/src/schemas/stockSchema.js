import { z } from "zod";

export const symbolSchema = z.object({
  symbol: z
    .string()
    .min(1, { message: "Symbol can't be empty" })
    .max(15, { message: "Symbol can't be more than 15 characters long" })
    .regex(/^[A-Z0-9=.\-^]+$/, { message: "Invalid symbol" })
    .transform((val) => val.toUpperCase()),
});

export const buyStockBodySchema = z.object({
  quantity: z
    .number({
      required_error: "Quantity is required",
      invalid_type_error: "Quantity must be a number",
    })
    .int({ message: "Quantity must be an integer" })
    .positive({ message: "Quantity must be greater than 0" }),
});

export const sellStockBodySchema = z.object({
  quantity: z
    .number({
      required_error: "Quantity is required",
      invalid_type_error: "Quantity must be a number",
    })
    .int({ message: "Quantity must be an integer" })
    .positive({ message: "Quantity must be greater than 0" }),
});

export const depositBodySchema = z.object({
  amount: z
    .number({
      required_error: "Amount is required",
      invalid_type_error: "Amount must be a number",
    })
    .positive({ message: "Amount must be greater than 0" }),
});

export const withdrawBodySchema = z.object({
  amount: z
    .number({
      required_error: "Amount is required",
      invalid_type_error: "Amount must be a number",
    })
    .positive({ message: "Amount must be greater than 0" }),
});

export const getStockSchema = z.object({
  symbol: z
    .string()
    .min(1, { message: "Symbol can't be empty" })
    .max(15, { message: "Symbol can't be more than 15 characters long" })
    .regex(/^[A-Z0-9=.\-^]+$/, { message: "Invalid symbol" })
    .transform((val) => val.toUpperCase()),
  range: z.enum(["D", "M", "Y"]).optional().default("M"),
});
