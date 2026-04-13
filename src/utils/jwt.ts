import "dotenv/config";
import jwt from "jsonwebtoken";

const ACCESS_SECRET_KEY: string = process.env.ACCESS_SECRET_KEY!;
const REFRESH_SECRET_KEY: string = process.env.REFRESH_SECRET_KEY!;

export function generateTokens(userPayload: Object) {
  const accessToken = jwt.sign({ userInfo: userPayload }, ACCESS_SECRET_KEY, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign(
    {
      userInfo: userPayload,
    },
    REFRESH_SECRET_KEY,
    { expiresIn: "1d" },
  );

  return { accessToken, refreshToken };
}
