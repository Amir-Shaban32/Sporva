import { z } from "zod";

export const createRefereeValidation = z.strictObject({
  first_name: z.string().min(2).optional().nullable(),
  last_name: z.string().min(2),
  birth_date: z.coerce.date(),
  nationality: z.string().min(4),
  is_retired: z.boolean().optional(),
  retired_date: z.coerce.date().optional().nullable(),
});

export const updateRefereeValidation = createRefereeValidation
  .partial()
  .refine((data) => Object.values(data).some((v) => v !== undefined), {
    message: "At least one field must be provided",
  });

export type CreateRefereeInput = z.infer<typeof createRefereeValidation>;
export type UpdateRefereeInput = z.infer<typeof updateRefereeValidation>;
