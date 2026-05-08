import { z } from "zod";
import { dateSchema } from "./date.schema";

export const retirementSchema = z.discriminatedUnion("is_retired", [
  z.object({
    is_retired: z.literal(false),
    retired_date: z
      .null({ message: "retired_date must be null when is_retired is false" })
      .optional(),
  }),
  z.object({
    is_retired: z.literal(true),
    retired_date: dateSchema.nullable().optional(),
  }),
]);
