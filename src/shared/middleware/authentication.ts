import { Request, Response, NextFunction } from "express";
import { UnauthorizedError } from "@shared/errors/app-error";
import { verifyAccessToken } from "@shared/utils/verify-token";

export const authentication = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const headers = req.headers.authorization;

  if (!headers || !headers.startsWith("Bearer ")) {
    throw new UnauthorizedError("Unauthorized");
  }

  const token = headers.split(" ")[1];
  if (!token) {
    throw new UnauthorizedError("Missing Token");
  }

  try {
    const payload = verifyAccessToken(token);
    req.user = {
      id: payload.userInfo.id,
      username: payload.userInfo.username,
      role: payload.userInfo.role,
    };
    next();
  } catch {
    next(new UnauthorizedError("Invalid or expired token"));
  }
};
