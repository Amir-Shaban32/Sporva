import { z } from "zod";

export const createTeamValidation = z.strictObject({
  name: z.string().min(4),
  founded_year: z.number().int().min(1857).max(new Date().getFullYear()),
  city: z.string().min(2),
  stadium: z.string().min(3),
  current_manager_id: z.cuid().optional(),
});

export const updateTeamValidation = createTeamValidation
  .partial()
  .refine((data) => Object.values(data).some((v) => v !== undefined), {
    message: "At least one field must be provided",
  });

export type CreateTeamInput = z.infer<typeof createTeamValidation>;
export type updateTeamInput = z.infer<typeof updateTeamValidation>;
