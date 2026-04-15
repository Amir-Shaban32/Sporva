import { JWTPayload, RefreshTokenInput, RefreshTokenResult } from "../../types";
import { ServiceResult } from "../../types";
import { generateTokens } from "../../utils/jwt";
import { getUserByUsernameService } from "../user.service";
import {
  revokeAllUserTokensService,
  deleteTokenService,
  getTokenByToken,
  createTokenService,
} from "./refresh-token.service";
import jwt from "jsonwebtoken";

const REFRESH_SECRET_KEY = process.env.REFRESH_SECRET_KEY!;

export const refreshTokenService = async (
  input: RefreshTokenInput,
): Promise<ServiceResult<RefreshTokenResult>> => {
  try {
    const cookieToken = input.cookieToken!;
    const foundToken = await getTokenByToken(cookieToken);
    if (!foundToken.success) {
      return new Promise((resolve) => {
        jwt.verify(cookieToken, REFRESH_SECRET_KEY, async (err, decoded) => {
          if (err) {
            resolve({
              success: false,
              error: err.message,
              code: "FORBIDDEN",
            });
            return;
          }
          const payload = decoded as JWTPayload;
          const hackedUser = await getUserByUsernameService(
            payload.userInfo.username,
          );
          if (hackedUser.success) {
            await revokeAllUserTokensService(hackedUser.data.id);
          }
          resolve({ success: false, error: "Forbidden!", code: "FORBIDDEN" });
        });
      });
    }

    await deleteTokenService(foundToken.data.id);

    return new Promise((resolve) => {
      jwt.verify(cookieToken, REFRESH_SECRET_KEY, async (err, decoded) => {
        if (err) {
          resolve({ success: false, error: "Forbidden!", code: "FORBIDDEN" });
          return;
        }
        const payload = decoded as JWTPayload;
        if (payload.userInfo.id !== foundToken.data.user_id) {
          resolve({ success: false, error: "Forbidden!", code: "FORBIDDEN" });
          return;
        }
        const userPayload = { ...payload.userInfo };
        const { accessToken, refreshToken } = generateTokens(userPayload);

        const deviceInfo = input.deviceInfo;
        const newToken = await createTokenService({
          user_id: foundToken.data.user_id,
          token: refreshToken,
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000),
          last_used: new Date(),
          device_info: JSON.parse(JSON.stringify(deviceInfo)),
        });

        if (!newToken.success) {
          resolve({
            success: false,
            error: "Failed to create session",
            code: "DB_ERROR",
          });
          return;
        }

        resolve({
          success: true,
          data: { accessToken, refreshToken },
        });
      });
    });
  } catch (error) {
    return { success: false, code: "DB_ERROR", error: "Database error" };
  }
};
