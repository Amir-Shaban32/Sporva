import { z } from "zod";
import { Competitions } from "generated/prisma";

export const matchBase = z.strictObject({
  season: z
    .string()
    .regex(/^\d{4}-\d{4}$/, "Season must be in format YYYY-YYYY")
    .refine(
      (val) => {
        const [start, end] = val.split("-").map(Number);
        return end === start + 1;
      },
      {
        message: "Season end year must be exactly 1 year after start year",
      },
    )
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
  got_extra_time: z.boolean().optional(),
});
