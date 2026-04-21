import { Request, Response, NextFunction } from "express";
import { ForbiddenError } from "src/errors/app-error";

export const verifyRole =
  (...roles: string[]) =>
  (req: Request, _res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role))
      throw new ForbiddenError("insufficient permissions");
    next();
  };
