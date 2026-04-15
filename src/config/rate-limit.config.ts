import { customRateLimitHandler } from "../middleware/error-handler.middleware";
import { Request } from "express";

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
    return `auth:${req.ip}:${email}`;
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
    return `refresh:${req.ip}:${userId}`;
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
    return `sensitive:${req.ip}:${userId}`;
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: customRateLimitHandler,
};
