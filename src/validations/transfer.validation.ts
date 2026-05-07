// transfer.validation.ts
import { z } from "zod";
import { Transfer_type } from "../../generated/prisma";
import { dateSchema } from "./date.schema";

const transferBase = z.strictObject({
  player_id: z.cuid(),
  from_team_id: z.cuid(),
  to_team_id: z.cuid(),
  transfer_date: dateSchema.optional(),
});

export const createTransferValidation = transferBase.and(
  z.discriminatedUnion("transfer_type", [
    z.strictObject({
      transfer_type: z.literal(Transfer_type.free),
      transfer_fee: z.literal(0),
    }),
    z.strictObject({
      transfer_type: z.literal(Transfer_type.permanent),
      transfer_fee: z.number().positive(),
    }),
    z.strictObject({
      transfer_type: z.literal(Transfer_type.loan),
      transfer_fee: z.number().min(0),
    }),
  ]),
);

export type CreateTransferInput = z.infer<typeof createTransferValidation>;
