import { z } from "zod";
import { Positions, Foot_preference } from "@generated/prisma";
import { dateSchema } from "@shared/utils/date.schema";
import { retirementSchema } from "@shared/utils/retirement.schema";

const playerBase = z.strictObject({
  first_name: z.string().min(2).optional().nullable(),
  last_name: z.string().min(2),
  birth_date: dateSchema,
  nationality: z.string().min(4),
  jersey_number: z.number().int().min(1).max(99),
  position: z.enum(Object.values(Positions) as [string, ...string[]]),
  preferred_foot: z
    .enum(Object.values(Foot_preference) as [string, ...string[]])
    .optional(),
  joined_date: dateSchema,
  team_id: z.cuid(),
});

export const createPlayerValidation = playerBase.and(retirementSchema);

export const updatePlayerValidation = playerBase
  .partial()
  .and(
    z.object({
      is_retired: z.boolean().optional(),
      retired_date: dateSchema.nullish().optional(),
    }),
  )
  .refine(
    (data) => {
      if (data.retired_date && data.is_retired !== true) return false;
      return true;
    },
    { message: "retired_date must be null when player is not retired" },
  )
  .refine((data) => Object.values(data).some((v) => v !== undefined), {
    message: "At least one field must be provided",
  });

export type CreatePlayerInput = z.infer<typeof createPlayerValidation>;
export type UpdatePlayerInput = z.infer<typeof updatePlayerValidation>;
