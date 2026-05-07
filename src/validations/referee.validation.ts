import { z } from "zod";
import { dateSchema } from "./date.schema";
import { retirementSchema } from "./retirement.schema";

const refereeBase = z.strictObject({
  first_name: z.string().min(2).optional().nullable(),
  last_name: z.string().min(2),
  birth_date: dateSchema,
  nationality: z.string().min(4),
});

export const createRefereeValidation = refereeBase.and(retirementSchema);

export const updateRefereeValidation = refereeBase
  .partial()
  .and(
    z.object({
      is_retired: z.boolean().optional(),
      retired_date: dateSchema.nullish().optional(),
    }),
  )
  .refine((data) => {
    if (data.retired_date && data.is_retired !== true) return false;
    return true;
  })
  .refine((data) => Object.values(data).some((v) => v !== undefined), {
    message: "At least one field must be provided",
  });

export type CreateRefereeInput = z.infer<typeof createRefereeValidation>;
export type UpdateRefereeInput = z.infer<typeof updateRefereeValidation>;
