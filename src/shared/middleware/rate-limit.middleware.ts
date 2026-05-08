import rateLimit from "express-rate-limit";
import {
  globalLimiterConfig,
  authLimiterConfig,
  sensitiveWriteLimiterConfig,
  refreshTokenLimiterConfig,
} from "../config";

export const globalLimiter = rateLimit(globalLimiterConfig);
export const authLimiter = rateLimit(authLimiterConfig);
export const sensitiveWriteLimiter = rateLimit(sensitiveWriteLimiterConfig);
export const refreshTokenLimiter = rateLimit(refreshTokenLimiterConfig);
