import { UnauthorizedError } from "@shared/errors/app-error";
import { JWTPayload } from "@shared/types/auth.type";
import jwt from "jsonwebtoken";
import { env } from "../config";

export const verifyAccessToken = (token: string): JWTPayload => {
  try {
    return jwt.verify(token, env.ACCESS_SECRET_KEY) as JWTPayload;
  } catch {
    throw new UnauthorizedError("Invalid or expired access token");
  }
};

export const verifyRefreshToken = (token: string): Promise<JWTPayload> =>
  new Promise((resolve, reject) => {
    jwt.verify(token, env.REFRESH_SECRET_KEY, (err, decoded) => {
      if (err) reject(new UnauthorizedError(err.message));
      else resolve(decoded as JWTPayload);
    });
  });
