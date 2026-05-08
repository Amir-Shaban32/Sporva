import { z } from "zod";
import { Match_status } from "@generated/prisma";

export const scoreRefinement = z.discriminatedUnion("status", [
  z.strictObject({
    status: z.literal(Match_status.SCHEDULED),
    guest_team_score: z.null().optional(),
    host_team_score: z.null().optional(),
  }),
  z.strictObject({
    status: z.literal(Match_status.POSTPONED),
    guest_team_score: z.null().optional(),
    host_team_score: z.null().optional(),
  }),
  z.strictObject({
    status: z.literal(Match_status.CANCELLED),
    guest_team_score: z.null().optional(),
    host_team_score: z.null().optional(),
  }),
  z.strictObject({
    status: z.literal(Match_status.FINISHED),
    guest_team_score: z.number().int().min(0),
    host_team_score: z.number().int().min(0),
  }),
  z.strictObject({
    status: z.literal(Match_status.LIVE),
    guest_team_score: z.number().int().min(0).nullable().optional(),
    host_team_score: z.number().int().min(0).nullable().optional(),
  }),
]);

export const scoreRefinementPartial = z.union([
  z.object({
    status: z.literal(Match_status.SCHEDULED).optional(),
    guest_team_score: z.null().optional(),
    host_team_score: z.null().optional(),
  }),
  z.object({
    status: z.literal(Match_status.POSTPONED).optional(),
    guest_team_score: z.null().optional(),
    host_team_score: z.null().optional(),
  }),
  z.object({
    status: z.literal(Match_status.CANCELLED).optional(),
    guest_team_score: z.null().optional(),
    host_team_score: z.null().optional(),
  }),
  z.object({
    status: z.literal(Match_status.FINISHED).optional(),
    guest_team_score: z.number().int().min(0).optional(),
    host_team_score: z.number().int().min(0).optional(),
  }),
  z.object({
    status: z.literal(Match_status.LIVE).optional(),
    guest_team_score: z.number().int().min(0).nullable().optional(),
    host_team_score: z.number().int().min(0).nullable().optional(),
  }),
  z.object({
    status: z.undefined().optional(),
    guest_team_score: z.undefined().optional(),
    host_team_score: z.undefined().optional(),
  }),
]);
