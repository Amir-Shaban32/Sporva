// manager.validation.ts
import { z } from "zod";

const managerBase = z.strictObject({
  first_name: z.string().min(2).optional().nullable(),
  last_name: z.string().min(2),
  birth_date: z.coerce.date(),
  nationality: z.string().min(4),
});

const retirementSchema = z.discriminatedUnion("is_retired", [
  z.strictObject({
    is_retired: z.literal(false),
    retired_date: z.null().optional(),
  }),
  z.strictObject({
    is_retired: z.literal(true),
    retired_date: z.coerce.date().nullable(),
  }),
]);

export const createManagerValidation = managerBase.and(retirementSchema);

export const updateManagerValidation = managerBase
  .partial()
  .and(
    retirementSchema.or(
      z.strictObject({
        is_retired: z.undefined(),
        retired_date: z.undefined(),
      }),
    ),
  )
  .refine((data) => Object.values(data).some((v) => v !== undefined), {
    message: "At least one field must be provided",
  });

export type CreateManagerInput = z.infer<typeof createManagerValidation>;
export type UpdateManagerInput = z.infer<typeof updateManagerValidation>;
