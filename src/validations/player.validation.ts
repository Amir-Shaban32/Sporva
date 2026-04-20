// player.validation.ts
import { z } from "zod";
import { Positions, Foot_preference } from "../../generated/prisma";

const playerBase = z.strictObject({
  first_name: z.string().min(2).optional().nullable(),
  last_name: z.string().min(2),
  birth_date: z.coerce.date(),
  nationality: z.string().min(4),
  jersey_number: z.number().int().min(1).max(99),
  position: z.enum([
    Positions.GK,
    Positions.RB,
    Positions.CB,
    Positions.LB,
    Positions.CDM,
    Positions.CM,
    Positions.AM,
    Positions.RW,
    Positions.LW,
    Positions.CF,
    Positions.ST,
  ]),
  preferred_foot: z
    .enum([Foot_preference.LEFT, Foot_preference.RIGHT])
    .optional(),
  joined_date: z.coerce.date(),
  team_id: z.cuid(),
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

export const createPlayerValidation = playerBase.and(retirementSchema);

export const updatePlayerValidation = playerBase
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

export type CreatePlayerInput = z.infer<typeof createPlayerValidation>;
export type UpdatePlayerInput = z.infer<typeof updatePlayerValidation>;
