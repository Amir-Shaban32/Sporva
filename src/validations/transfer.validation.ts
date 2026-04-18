import { z } from "zod";
import { Transfer_type } from "../../generated/prisma";

export const createTransferValidation = z.strictObject({
  player_id: z.cuid(),
  from_team_id: z.cuid(),
  to_team_id: z.cuid(),
  transfer_date: z.coerce.date().optional(),
  transfer_fee: z.number().positive("Transfer fee must be positive"),
  transfer_type: z.enum([
    Transfer_type.permanent,
    Transfer_type.free,
    Transfer_type.loan,
  ]),
});

export type CreateTransferInput = z.infer<typeof createTransferValidation>;
