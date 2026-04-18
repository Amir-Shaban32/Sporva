import { z } from "zod";

export const createManagerValidation = z.strictObject({
  first_name: z.string().min(2).optional().nullable(),
  last_name: z.string().min(2),
  birth_date: z.coerce.date(),
  nationality: z.string().min(4),
  is_retired: z.boolean().optional(),
  retired_date: z.coerce.date().optional().nullable(),
});

export const updateManagerValidation = createManagerValidation
  .partial()
  .refine((data) => Object.values(data).some((v) => v !== undefined), {
    message: "At least one field must be provided",
  });

export type CreateManagerInput = z.infer<typeof createManagerValidation>;
export type UpdateManagerInput = z.infer<typeof updateManagerValidation>;
