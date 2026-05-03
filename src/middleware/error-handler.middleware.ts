import { Request, Response, NextFunction } from "express";
import {
  AppError,
  BadRequestError,
  ConflictError,
  NotFoundError,
  ServerError,
  TooManyRequestsError,
} from "../errors/app-error";
import { ApiResponse } from "../response/api-response";
import { StatusCodes } from "http-status-codes";
import { Prisma } from "generated/prisma";
import { logger, env } from "../config";

export const prismaErrorHandler = (
  err: Prisma.PrismaClientKnownRequestError,
): AppError => {
  switch (err.code) {
    case "P2002":
      return new ConflictError("Duplicate entry — unique constraint failed");
    case "P2025":
      return new NotFoundError("Record not found");
    case "P2003":
      return new BadRequestError("Foreign key constraint failed", {
        field: err.meta.field_name,
      });
    default:
      return new ServerError("Database operation failed");
  }
};

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const isProd = env.NODE_ENV === "production";
  if (err instanceof TooManyRequestsError) {
    return res.status(StatusCodes.TOO_MANY_REQUESTS).json({
      ...ApiResponse.formatError(err.message),
      ...(err.retryAfter && { meta: { retryAfter: err.retryAfter } }),
    });
  }

  if (err instanceof AppError && err.isOperational) {
    if (
      err.statusCode === StatusCodes.FORBIDDEN ||
      (err.statusCode === StatusCodes.UNAUTHORIZED && req.method !== "OPTIONS")
    ) {
      logger.warn(
        {
          status: err.statusCode,
          message: err.message,
          route: req.originalUrl,
          method: req.method,
          user_id: req.user?.id ?? "unauthenticated",
        },
        "Auth failure",
      );
    }
    const generalMessage =
      err.isOperational || !isProd ? err.message : "Internal server error";
    const generalErrors = err.isOperational || !isProd ? err.errors : undefined;
    return res
      .status(err.statusCode)
      .json(ApiResponse.formatError(generalMessage, generalErrors));
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    const prismaErrors = prismaErrorHandler(err);
    return res
      .status(prismaErrors.statusCode)
      .json(
        ApiResponse.formatError(
          prismaErrors.message,
          prismaErrors.errors,
          req.id as string,
        ),
      );
  }

  const unexpectedErr = err as Error;
  logger.error(unexpectedErr);
  return res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json(
      ApiResponse.formatError(
        isProd ? "Internal server error" : unexpectedErr.message,
        isProd ? undefined : { stack: unexpectedErr.stack },
      ),
    );
};

export const notFoundHandler = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  next(new NotFoundError(`Route ${req.method} ${req.originalUrl} not found`));
};
