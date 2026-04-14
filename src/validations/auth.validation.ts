import { z } from "zod";
import { User_Role } from "../../generated/prisma";

const passwordValidation = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[a-z]/, "Must contain a lowercase letter")
  .regex(/[A-Z]/, "Must contain an uppercase letter")
  .regex(/\d/, "Must contain a number")
  .regex(/[@$!%*?&]/, "Must contain a special character (@$!%*?&)");

const baseUserSchema = z.object({
  username: z.string().min(2),
  email: z.email(),
  password: passwordValidation,
  confirmPassword: z.string(),
  role: z.enum([User_Role.ADMIN, User_Role.USER]).optional(),
});

export const registerValidation = baseUserSchema.refine(
  (data) => data.password === data.confirmPassword,
  {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  },
);

export const loginValidation = z.object({
  username: z.string().min(2, "Username must be at least 2 characters"),
  password: passwordValidation,
});

export type RegisterInput = z.infer<typeof registerValidation>;
export type LoginInput = z.infer<typeof loginValidation>;
