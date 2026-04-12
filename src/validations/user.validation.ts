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

export const createUserValidation = baseUserSchema.refine(
  (data) => data.password === data.confirmPassword,
  {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  },
);

export const updateUserValidation = baseUserSchema
  .omit({ confirmPassword: true })
  .partial()
  .refine((data) => Object.values(data).some((v) => v !== undefined), {
    message: "At least one field must be provided",
  });

export type CreateUserInput = z.infer<typeof createUserValidation>;
export type UpdateUserInput = z.infer<typeof updateUserValidation>;
