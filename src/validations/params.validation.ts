import { z } from "zod";

export const idParamsValidation = z.object({
  id: z.cuid("Invalid ID format"),
});

export const teamIdParamsValidation = z.object({
  teamId: z.cuid("Invalid ID format"),
});

export const playerIdParamsValidation = z.object({
  playerId: z.cuid("Invalid ID format"),
});

export const managerIdParamsValidation = z.object({
  managerId: z.cuid("Invalid ID format"),
});

export const matchIdParamsValidation = z.object({
  matchId: z.cuid("Invalid ID format"),
});

export const refereeIdParamsValidation = z.object({
  refereeId: z.cuid("Invalid ID format"),
});
