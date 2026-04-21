import { customRateLimitHandler } from "../handlers/rate-limit.handler";
import { Request } from "express";
import { ipKeyGenerator } from "express-rate-limit";

export const globalLimiterConfig = {
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  handler: customRateLimitHandler,
};

export const authLimiterConfig = {
  windowMs: 15 * 60 * 1000,
  max: 10,
  skipSuccessfulRequests: false,
  keyGenerator: (req: Request): string => {
    const email = req.body?.email ?? "unknown";
    return `auth:${ipKeyGenerator(req.ip ?? "")}:${email}`;
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: customRateLimitHandler,
};

export const refreshTokenLimiterConfig = {
  windowMs: 15 * 60 * 1000,
  max: 30,
  skipSuccessfulRequests: true,
  keyGenerator: (req: Request): string => {
    const userId = req.body?.user_id ?? "unknown";
    return `refresh:${ipKeyGenerator(req.ip ?? "")}:${userId}`;
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: customRateLimitHandler,
};

export const sensitiveWriteLimiterConfig = {
  windowMs: 60 * 60 * 1000,
  max: 20,
  skipSuccessfulRequests: false,
  keyGenerator: (req: Request): string => {
    const userId = req.body?.user_id ?? "unknown";
    return `sensitive:${ipKeyGenerator(req.ip ?? "")}:${userId}`;
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: customRateLimitHandler,
};
