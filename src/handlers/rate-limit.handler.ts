import { Request, Response, NextFunction } from "express";
import { TooManyRequestsError } from "../errors/app-error";

export const customRateLimitHandler = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const retryAfter = req.rateLimit?.resetTime
    ? req.rateLimit.resetTime.toISOString()
    : undefined;

  next(
    new TooManyRequestsError(
      `Too many attempts. Please try again at ${retryAfter ?? "a later time"}.`,
      retryAfter,
    ),
  );
};
