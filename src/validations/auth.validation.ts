import { z } from "zod";

export const signupSchema = z.object({
  username : z
  .string()
  .min(2, "Name must be at least 2 characters long")
  .max(50, "Name is too long"),

  email : z
  .email({
    error : "Invalid Email"
  }),

  password : z
  .string()
  .min(6, "Password must be at least 6 characters")
})

export const loginSchema = z.object({
  username : z
  .string()
  .min(2, "Name must be at least 2 characters long")
  .max(50,"Name is too long"),

  password : z
  .string()
  .min(1,"Password is required")
})