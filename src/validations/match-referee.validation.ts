import { z } from "zod";
import { Referee_role } from "../../generated/prisma";

export const createMatchRefereeValidation = z.strictObject({
  match_id: z.cuid(),
  referee_id: z.cuid(),
  role: z.enum([
    Referee_role.MAIN,
    Referee_role.ASSISTANT_1,
    Referee_role.ASSISTANT_2,
    Referee_role.VAR,
  ]),
});

export const updateMatchRefereeValidation = createMatchRefereeValidation
  .partial()
  .refine((data) => Object.values(data).some((v) => v !== undefined), {
    message: "At least one field must be provided",
  });

export type CreateMatchRefereeInput = z.infer<
  typeof createMatchRefereeValidation
>;
export type UpdateMatchRefereeInput = z.infer<
  typeof updateMatchRefereeValidation
>;
