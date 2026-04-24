import { z } from "zod";
import {
  penaltyUnion,
  matchBase,
  scoreRefinement,
  teamIdRefinement,
  extraTimeAndPenaltyRefinement,
  penaltyUnionPartial,
  scoreRefinementPartial,
} from "../match";

export const createMatchValidation = matchBase
  .and(penaltyUnion)
  .and(scoreRefinement)
  .superRefine(teamIdRefinement)
  .superRefine(extraTimeAndPenaltyRefinement);

export const updateMatchValidation = matchBase
  .partial()
  .and(penaltyUnionPartial)
  .and(scoreRefinementPartial)
  .refine((data) => Object.values(data).some((v) => v !== undefined), {
    message: "At least one field must be provided",
  });

export type CreateMatchInput = z.infer<typeof createMatchValidation>;
export type UpdateMatchInput = z.infer<typeof updateMatchValidation>;
