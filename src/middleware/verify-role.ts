import { Request, Response, NextFunction } from "express";
import { ForbiddenError, UnauthorizedError } from "src/errors/app-error";

export const verifyRole =
  (...roles: string[]) =>
  (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) throw new UnauthorizedError("Authentication required");
    if (!roles.includes(req.user.role))
      throw new ForbiddenError("insufficient permissions");
    next();
  };
