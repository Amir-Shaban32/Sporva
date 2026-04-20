import { Request, Response, NextFunction } from "express";
import { AppError, TooManyRequestsError } from "../errors/app-error";
import { ApiResponse } from "../response/api-response";
import { StatusCodes } from "http-status-codes";

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const isProd = process.env.NODE_ENV === "production";
  if (err instanceof TooManyRequestsError) {
    return res.status(StatusCodes.TOO_MANY_REQUESTS).json({
      ...ApiResponse.formatError(err.message),
      ...(err.retryAfter && { meta: { retryAfter: err.retryAfter } }),
    });
  }

  if (err instanceof AppError && err.isOperational) {
    const generalMessage =
      err.isOperational || !isProd ? err.message : "Internal server error";
    const generalErrors = err.isOperational || !isProd ? err.errors : undefined;
    return res
      .status(err.statusCode)
      .json(ApiResponse.formatError(generalMessage, generalErrors));
  }

  const unexpectedErr = err as Error;
  console.error("UNEXPECTED ERROR: ", unexpectedErr);
  return res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json(
      ApiResponse.formatError(
        isProd ? "Internal server error" : unexpectedErr.message,
        isProd ? undefined : { stack: unexpectedErr.stack },
      ),
    );
};
