import { z } from "zod";

export const baseManagerContractValidation = z.strictObject({
  manager_id: z.cuid(),
  team_id: z.cuid(),
  start_date: z.coerce.date(),
  end_date: z.coerce.date(),
  annual_salary: z.number().positive("Salary must be positive"),
  is_active: z.boolean().optional(),
});

export const createManagerContractValidation =
  baseManagerContractValidation.refine(
    (data) => data.end_date > data.start_date,
    {
      message: "End date must be after start date",
      path: ["end_date"],
    },
  );

export type CreateManagerContractInput = z.infer<
  typeof createManagerContractValidation
>;
