import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../utils/api-response";

declare global {
  namespace Express {
    interface Response {
      ok(message: string, data?: any): Response;
      created(message: string, data?: any): Response;
      badRequest(message: string, errors?: Record<string, string[]>): Response;
      notFound(message: string): Response;
      unauthorized(message: string): Response;
      forbidden(message: string): Response;
      conflict(message: string): Response;
      serverError(message: string): Response;
    }
  }
}

export const responseMiddleware = (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  res.ok = (message: string, data?: any) =>
    res.status(200).json(new ApiResponse(200, data, message));

  res.created = (message: string, data?: any) =>
    res.status(201).json(new ApiResponse(201, data, message));

  res.badRequest = (
    message: string,
    errors: Record<string, string[]> | undefined,
  ) => res.status(400).json(new ApiResponse(400, undefined, message, errors));

  res.notFound = (message: string) =>
    res.status(404).json(new ApiResponse(404, undefined, message));

  res.unauthorized = (message: string) =>
    res.status(401).json(new ApiResponse(401, undefined, message));

  res.forbidden = (message: string) =>
    res.status(403).json(new ApiResponse(403, undefined, message));

  res.conflict = (message: string) =>
    res.status(409).json(new ApiResponse(409, undefined, message));

  res.serverError = (message: string) =>
    res.status(500).json(new ApiResponse(500, undefined, message));

  next();
};
