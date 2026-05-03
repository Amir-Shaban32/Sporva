import { Request, Response, NextFunction } from "express";
import { TooManyRequestsError } from "../errors/app-error";
import { logger } from "../config";

export const customRateLimitHandler = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const retryAfter = req.rateLimit?.resetTime
    ? req.rateLimit.resetTime.toISOString()
    : undefined;

  logger.warn(
    {
      ip: req.ip,
      route: req.originalUrl,
      method: req.method,
      user_id: req.user?.id ?? "unauthenticated",
    },
    "Rate limit exceeded",
  );

  next(
    new TooManyRequestsError(
      `Too many attempts. Please try again at ${retryAfter ?? "a later time"}.`,
      retryAfter,
    ),
  );
};
