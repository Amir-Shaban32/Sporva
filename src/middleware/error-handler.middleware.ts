import { Request, Response } from "express";

export const customRateLimitHandler = (req: Request, res: Response) => {
  res.status(429).json({
    error: "Rate limit exceeded",
    message: "Too many attempts. Please try again after 15 minutes.",
    retryAfter: req.rateLimit?.resetTime
      ? new Date(req.rateLimit.resetTime).toISOString()
      : undefined,
  });
};
