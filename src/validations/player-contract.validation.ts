import { z } from "zod";

export const basePlayerContractValidation = z.strictObject({
  player_id: z.cuid(),
  team_id: z.cuid(),
  start_date: z.coerce.date(),
  end_date: z.coerce.date(),
  annual_salary: z.number().positive("Salary must be positive"),
  is_active: z.boolean().optional(),
});

export const createPlayerContractValidation =
  basePlayerContractValidation.refine(
    (data) => data.end_date > data.start_date,
    {
      message: "End date must be after start date",
      path: ["end_date"],
    },
  );

export type CreatePlayerContractInput = z.infer<
  typeof createPlayerContractValidation
>;
