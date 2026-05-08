import jwt from "jsonwebtoken";
import { env } from "../config";
import { StringValue } from "ms";

export function generateTokens(userPayload: object) {
  const accessToken = jwt.sign(
    { userInfo: userPayload },
    env.ACCESS_SECRET_KEY,
    {
      expiresIn: env.ACCESS_TOKEN_EXPIRES_IN as StringValue | number,
    },
  );

  const refreshToken = jwt.sign(
    { userInfo: userPayload },
    env.REFRESH_SECRET_KEY,
    {
      expiresIn: env.REFRESH_TOKEN_EXPIRES_IN as StringValue | number,
    },
  );

  return { accessToken, refreshToken };
}
