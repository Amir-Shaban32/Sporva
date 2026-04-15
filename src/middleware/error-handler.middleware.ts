import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/app-error";

export const errorHandler = (
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const statusCode = err.statusCode || 500;
  const message = err.isOperational ? err.message : "Unexpected Error";

  if (!err.isOperational) console.error("UNEXPECTED ERROR: ", err);

  return res.json({
    status: "error",
    statusCode,
    message,
  });
};

export const customRateLimitHandler = (req: Request, res: Response) => {
  res.status(429).json({
    error: "Rate limit exceeded",
    message: "Too many attempts. Please try again after 15 minutes.",
    retryAfter: req.rateLimit?.resetTime
      ? new Date(req.rateLimit.resetTime).toISOString()
      : undefined,
  });
};
