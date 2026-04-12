import { z } from "zod";
import { Event_types } from "../../generated/prisma";

export const createMatchEventValidation = z.object({
  match_id: z.cuid(),
  player_id: z.cuid(),
  team_id: z.cuid(),
  event_type: z.enum([
    Event_types.GOAL,
    Event_types.ASSIST,
    Event_types.OWN_GOAL,
    Event_types.SUB_IN,
    Event_types.SUB_OUT,
    Event_types.YELLOW_CARD,
    Event_types.RED_CARD,
    Event_types.SCORE_PENALTY,
    Event_types.CAUSE_PENALTY,
  ]),
  minute: z.number().int().min(0).max(120),
});

export const updateMatchEventValidation = createMatchEventValidation
  .partial()
  .refine((data) => Object.values(data).some((v) => v !== undefined), {
    message: "At least one field must be provided",
  });

export type CreateMatchEventInput = z.infer<typeof createMatchEventValidation>;
export type UpdateMatchEventInput = z.infer<typeof updateMatchEventValidation>;
