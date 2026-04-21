import { UnauthorizedError } from "src/errors/app-error";
import { JWTPayload } from "../types";
import jwt from "jsonwebtoken";

const REFRESH_SECRET_KEY = process.env.REFRESH_SECRET_KEY!;
const ACCESS_SECRET_KEY = process.env.ACCESS_SECRET_KEY!;

export const verifyAccessToken = (token: string): JWTPayload => {
  try {
    return jwt.verify(token, ACCESS_SECRET_KEY) as JWTPayload;
  } catch (err) {
    throw new UnauthorizedError("Invalid or expired access token");
  }
};

export const verifyRefreshToken = (token: string): Promise<JWTPayload> =>
  new Promise((resolve, reject) => {
    jwt.verify(token, REFRESH_SECRET_KEY, (err, decoded) => {
      if (err) reject(new UnauthorizedError(err.message));
      else resolve(decoded as JWTPayload);
    });
  });
