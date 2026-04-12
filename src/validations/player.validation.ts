import { z } from "zod";
import { Positions, Foot_preference } from "../../generated/prisma";

export const createPlayerValidation = z.object({
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
  is_retired: z.boolean().optional(),
  retired_date: z.coerce.date().optional().nullable(),
});

export const updatePlayerValidation = createPlayerValidation
  .partial()
  .refine((data) => Object.values(data).some((v) => v !== undefined), {
    message: "At least one field must be provided",
  });

export type CreatePlayerInput = z.infer<typeof createPlayerValidation>;
export type UpdatePlayerInput = z.infer<typeof updatePlayerValidation>;
