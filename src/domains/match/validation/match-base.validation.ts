import { z } from "zod";
import { Competitions } from "@generated/prisma";
import { dateSchema } from "@shared/utils/date.schema";

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
  match_time: dateSchema,
  competition: z.enum(
    Object.values(Competitions) as unknown as [Competitions, ...Competitions[]],
  ),
  got_extra_time: z.boolean().optional(),
});
