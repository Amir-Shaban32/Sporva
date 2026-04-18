import { z } from "zod";

export const createManagerContractValidation = z.strictObject({
  manager_id: z.cuid(),
  team_id: z.cuid(),
  start_date: z.coerce.date(),
  end_date: z.coerce.date(),
  annual_salary: z.number().positive("Salary must be positive"),
  is_active: z.boolean().optional(),
});

export const updateManagerContractValidation = createManagerContractValidation
  .partial()
  .refine((data) => Object.values(data).some((v) => v !== undefined), {
    message: "At least one field must be provided",
  });

export type CreateManagerContractInput = z.infer<
  typeof createManagerContractValidation
>;
export type UpdateManagerContractInput = z.infer<
  typeof updateManagerContractValidation
>;
