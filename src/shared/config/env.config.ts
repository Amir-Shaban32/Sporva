import "dotenv/config";
import { z } from "zod";
import ms from "ms";

const EXPIRES_REGEX = /^\d+(ms|s|m|h|d|w|y)$/;

const expiresInSchema = (minMs: number, maxMs: number, label: string) => {
  return z.union([
    z
      .string()
      .regex(EXPIRES_REGEX, "Invalid format (e.g. 15m, 1h, 7d)")
      .refine(
        (val) => {
          const t = ms(val as ms.StringValue);
          return t >= minMs && t <= maxMs;
        },
        {
          message: `${label} must be between ${ms(minMs)} and ${ms(maxMs)}`,
        },
      ),
    z
      .number()
      .int()
      .positive()
      .min(minMs / 1000)
      .max(maxMs / 1000),
  ]);
};

const MIN_15M = 15 * 60 * 1000;
const MAX_1H = 60 * 60 * 1000;
const MIN_1D = 24 * 60 * 60 * 1000;
const MAX_30D = 30 * 24 * 60 * 60 * 1000;

const envSchema = z
  .object({
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .optional()
      .default("development"),
    DATABASE_URL: z
      .url()
      .refine(
        (val) =>
          val.startsWith("postgresql://") || val.startsWith("postgres://"),
        {
          message: "DATABASE_URL must be a valid PostgreSQL connection string",
        },
      ),
    ACCESS_SECRET_KEY: z.string().min(12, "Must be at least 12 characters"),
    REFRESH_SECRET_KEY: z.string().min(12, "Must be at least 12 characters"),
    ACCESS_TOKEN_EXPIRES_IN: expiresInSchema(
      MIN_15M,
      MAX_1H,
      "Access token expiry",
    ),
    REFRESH_TOKEN_EXPIRES_IN: expiresInSchema(
      MIN_1D,
      MAX_30D,
      "Refresh token expiry",
    ),
    ADMIN_EMAIL: z.email(),
    ADMIN_PASSWORD: z.string().min(8),
    PINO_LOG_LEVEL: z
      .enum(["trace", "debug", "info", "warn", "error", "fatal"])
      .optional()
      .default("info"),
    BETTER_STACK_TOKEN: z.string().optional(),
    ALLOWED_ORIGINS: z.string().default("http://localhost:3000"),
    PORT: z.coerce.number().int().positive().default(3000),
  })
  .superRefine((data, ctx) => {
    if (data.NODE_ENV === "production" && !data.BETTER_STACK_TOKEN) {
      ctx.addIssue({
        code: "custom",
        path: ["BETTER_STACK_TOKEN"],
        message: "BETTER_STACK_TOKEN is required in production",
      });
    }
  });

const result = envSchema.safeParse(process.env);

if (!result.success) {
  const flattenErr = z.flattenError(result.error);
  console.error("Invalid environment variables");

  const fieldErrors = flattenErr.fieldErrors as Record<
    string,
    string[] | undefined
  >;
  for (const issue of result.error.issues) {
    console.error(`  ${issue.path.join(".")}: ${issue.message}`);
  }
  process.exit(1);
}

export const env = result.data;
export type Env = typeof env;
