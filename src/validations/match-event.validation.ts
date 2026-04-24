import { z } from "zod";
import { Event_types } from "../../generated/prisma";

export const createMatchEventValidation = z.strictObject({
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

export type CreateMatchEventInput = z.infer<typeof createMatchEventValidation>;
