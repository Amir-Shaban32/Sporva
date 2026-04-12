import { z } from "zod";

export const createPlayerContractValidation = z.object({
  player_id: z.cuid(),
  team_id: z.cuid(),
  start_date: z.coerce.date(),
  end_date: z.coerce.date(),
  annual_salary: z.number().positive("Salary must be positive"),
  is_active: z.boolean().optional(),
});

export const updatePlayerContractValidation = createPlayerContractValidation
  .partial()
  .refine((data) => Object.values(data).some((v) => v !== undefined), {
    message: "At least one field must be provided",
  });

export type CreatePlayerContractInput = z.infer<
  typeof createPlayerContractValidation
>;
export type UpdatePlayerContractInput = z.infer<
  typeof updatePlayerContractValidation
>;
