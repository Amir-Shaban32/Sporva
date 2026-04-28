import { z } from "zod";
import { Event_types } from "../../generated/prisma";

export const createMatchEventValidation = z.strictObject({
  match_id: z.cuid(),
  player_id: z.cuid(),
  team_id: z.cuid(),
  event_type: z
    .string()
    .transform((val) => val.toUpperCase())
    .pipe(z.enum(Object.values(Event_types) as [string, ...string[]])),
  minute: z.number().int().min(0).max(120),
});

export type CreateMatchEventInput = z.infer<typeof createMatchEventValidation>;
