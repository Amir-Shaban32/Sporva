import { z } from "zod";

const refereeBase = z.strictObject({
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

export const createRefereeValidation = refereeBase.and(retirementSchema);

export const updateRefereeValidation = refereeBase
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

export type CreateRefereeInput = z.infer<typeof createRefereeValidation>;
export type UpdateRefereeInput = z.infer<typeof updateRefereeValidation>;
