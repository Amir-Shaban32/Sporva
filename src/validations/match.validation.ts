import { z } from "zod";
import { Competitions, Match_status } from "../../generated/prisma";

export const createMatchValidation = z.object({
  season: z
    .string()
    .regex(/^\d{4}-\d{4}$/, "Season must be in format YYYY-YYYY")
    .optional(),
  round: z.number().int().min(1),
  stadium: z.string().min(3),
  host_team_id: z.cuid(),
  guest_team_id: z.cuid(),
  match_time: z.coerce.date(),
  competition: z.enum([
    Competitions.LEAGUE,
    Competitions.CUP,
    Competitions.SUPER,
    Competitions.CAF,
  ]),
  status: z.enum([
    Match_status.SCHEDULED,
    Match_status.LIVE,
    Match_status.FINISHED,
    Match_status.CANCELLED,
  ]),
  host_team_score: z.number().int().min(0).optional(),
  guest_team_score: z.number().int().min(0).optional(),
  got_extra_time: z.boolean().optional(),
  got_penalties: z.boolean().optional(),
  host_penalty_score: z.number().int().min(0).optional().nullable(),
  guest_penalty_score: z.number().int().min(0).optional().nullable(),
});

export const updateMatchValidation = createMatchValidation
  .partial()
  .refine((data) => Object.values(data).some((v) => v !== undefined), {
    message: "At least one field must be provided",
  });

export type CreateMatchInput = z.infer<typeof createMatchValidation>;
export type UpdateMatchInput = z.infer<typeof updateMatchValidation>;
