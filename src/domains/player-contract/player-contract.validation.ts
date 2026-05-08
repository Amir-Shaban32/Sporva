import { z } from "zod";
import { dateSchema } from "@shared/utils/date.schema";

export const basePlayerContractValidation = z.strictObject({
  player_id: z.cuid(),
  team_id: z.cuid(),
  start_date: dateSchema,
  end_date: dateSchema,
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
