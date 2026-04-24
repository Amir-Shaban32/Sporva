import { z } from "zod";
import { Positions, Match_status, Competitions } from "generated/prisma";

const toUpperCaseEnum = (values: [string, ...string[]]) =>
  z.preprocess(
    (val) => (typeof val === "string" ? val.toUpperCase() : val),
    z.enum(values),
  );

export const paginationValidation = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

export const usernameValidation = z.object({
  username: z.string().min(2, "Username is required"),
});

export const nameValidation = z.object({
  username: z.string().min(2, "Name is required"),
});

export const emailValidation = z.object({
  email: z.email("Email is required"),
});

export const cityValidation = z.object({
  city: z.string().min(2, "City is required"),
});

export const nationalityValidation = z.object({
  city: z.string().min(2, "Nationality is required"),
});

export const intervalValidation = z.object({
  period: z
    .string()
    .regex(/^\d+[ymd]$/i, "Invalid period format")
    .transform((val) => val.toLocaleLowerCase()),
});

export const positionValidation = z.object({
  position: toUpperCaseEnum(Object.values(Positions) as [string, ...string[]]),
});

export const matchStatusValidation = z.object({
  status: z
    .string()
    .transform((val) => val.toUpperCase())
    .pipe(z.enum(Object.values(Match_status) as [string, ...string[]])),
});

export const competitionValidation = z.object({
  competition: toUpperCaseEnum(
    Object.values(Competitions) as [string, ...string[]],
  ),
});

export const dateValidation = z.object({
  date: z.coerce.date(),
});

export const seasonValidation = z.object({
  season: z
    .string()
    .regex(/^\d{4}-\d{4}$/, "Season must be in format YYYY-YYYY"),
});

export const roundValidation = z.object({
  round: z.coerce.number().int().min(1, "Round must be at least 1"),
});

export type PaginationQuery = z.infer<typeof paginationValidation>;
