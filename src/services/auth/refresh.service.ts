import { JWTPayload, RefreshTokenInput, RefreshTokenResult } from "../../types";
import { generateTokens } from "../../utils/jwt";
import { getUserByUsernameService } from "../user.service";
import {
  revokeAllUserTokensService,
  deleteTokenService,
  getTokenByToken,
  createTokenService,
} from "./refresh-token.service";
import jwt from "jsonwebtoken";
import { UnauthorizedError, ServerError } from "../../errors/app-error";

const REFRESH_SECRET_KEY = process.env.REFRESH_SECRET_KEY!;

export const refreshTokenService = async (
  input: RefreshTokenInput,
): Promise<RefreshTokenResult> => {
  const cookieToken = input.cookieToken!;

  let foundToken;
  try {
    foundToken = await getTokenByToken(cookieToken);
  } catch (error) {
    // Token not in DB, verify JWT and check for hacked user
    return new Promise((resolve, reject) => {
      jwt.verify(cookieToken, REFRESH_SECRET_KEY, async (err, decoded) => {
        if (err) {
          reject(new UnauthorizedError(err.message));
          return;
        }
        const payload = decoded as JWTPayload;
        try {
          const hackedUser = await getUserByUsernameService(
            payload.userInfo.username,
          );
          // If user found, revoke all tokens
          await revokeAllUserTokensService(hackedUser.id);
        } catch {
          // User not found, ignore
        }
        reject(new UnauthorizedError("Forbidden!"));
      });
    });
  }

  await deleteTokenService(foundToken.id);

  return new Promise((resolve, reject) => {
    jwt.verify(cookieToken, REFRESH_SECRET_KEY, async (err, decoded) => {
      if (err) {
        reject(new UnauthorizedError("Forbidden!"));
        return;
      }
      const payload = decoded as JWTPayload;
      if (payload.userInfo.id !== foundToken.user_id) {
        reject(new UnauthorizedError("Forbidden!"));
        return;
      }
      const userPayload = { ...payload.userInfo };
      const { accessToken, refreshToken } = generateTokens(userPayload);

      const deviceInfo = input.deviceInfo;
      const newToken = await createTokenService({
        user_id: foundToken.user_id,
        token: refreshToken,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000),
        last_used: new Date(),
        device_info: JSON.parse(JSON.stringify(deviceInfo)),
      });

      resolve({
        accessToken,
        refreshToken,
      });
    });
  });
};
