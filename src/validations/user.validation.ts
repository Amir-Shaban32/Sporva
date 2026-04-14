import { z } from "zod";
import { User_Role } from "../../generated/prisma";

const passwordValidation = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[a-z]/, "Must contain a lowercase letter")
  .regex(/[A-Z]/, "Must contain an uppercase letter")
  .regex(/\d/, "Must contain a number")
  .regex(/[@$!%*?&]/, "Must contain a special character (@$!%*?&)");

export const createUserValidation = z.object({
  username: z.string().min(2),
  email: z.email(),
  password: passwordValidation,
  role: z.enum([User_Role.ADMIN, User_Role.USER]).optional(),
});

export const updateUserValidation = createUserValidation
  .partial()
  .refine((data) => Object.values(data).some((v) => v !== undefined), {
    message: "At least one field must be provided",
  });

export type CreateUserInput = z.infer<typeof createUserValidation>;
export type UpdateUserInput = z.infer<typeof updateUserValidation>;
