import { z } from "zod";

export const penaltyUnion = z.discriminatedUnion("got_penalties", [
  z.strictObject({
    got_penalties: z.literal(true),
    host_penalty_score: z.number().int().min(0),
    guest_penalty_score: z.number().int().min(0),
  }),
  z.strictObject({
    got_penalties: z.literal(false).optional(),
    host_penalty_score: z.null().optional(),
    guest_penalty_score: z.null().optional(),
  }),
]);

export const penaltyUnionPartial = z.union([
  z.object({
    got_penalties: z.literal(true),
    host_penalty_score: z.number().int().min(0),
    guest_penalty_score: z.number().int().min(0),
  }),
  z.object({
    got_penalties: z.literal(false),
    host_penalty_score: z.null(),
    guest_penalty_score: z.null(),
  }),
  z.object({
    got_penalties: z.undefined().optional(),
    host_penalty_score: z.undefined().optional(),
    guest_penalty_score: z.undefined().optional(),
  }),
]);
