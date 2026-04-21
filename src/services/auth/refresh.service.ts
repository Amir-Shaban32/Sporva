import { RefreshTokenInput, RefreshTokenResult } from "../../types";
import { generateTokens } from "../../utils/jwt";
import { getUserByUsernameService } from "../user.service";
import {
  revokeAllUserTokensService,
  deleteTokenService,
  getTokenByTokenService,
  createTokenService,
} from "./refresh-token.service";
import { ForbiddenError, UnauthorizedError } from "../../errors/app-error";
import { verifyRefreshToken } from "../../utils/verify-token";

export const refreshTokenService = async (
  input: RefreshTokenInput,
): Promise<RefreshTokenResult> => {
  const cookieToken = input.cookieToken;
  if (!cookieToken) throw new UnauthorizedError("No refresh token provided");

  const foundToken = await getTokenByTokenService(cookieToken);
  if (!foundToken) {
    await handlePossibleTokenReuse(cookieToken);
    throw new ForbiddenError("Token reuse detected");
  }

  if (foundToken.expires_at < new Date()) {
    await deleteTokenService(foundToken.id);
    throw new UnauthorizedError("Refresh token expired");
  }

  const payload = await verifyRefreshToken(cookieToken);

  if (payload.userInfo.id !== foundToken.user_id) {
    throw new ForbiddenError("Token mismatch");
  }

  await deleteTokenService(foundToken.id);
  const userPayload = { ...payload.userInfo };
  const { accessToken, refreshToken } = generateTokens(userPayload);

  const deviceInfo = input.deviceInfo;
  await createTokenService({
    user_id: foundToken.user_id,
    token: refreshToken,
    expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000),
    last_used: new Date(),
    device_info: JSON.parse(JSON.stringify(deviceInfo)),
  });

  return { accessToken, refreshToken };
};

const handlePossibleTokenReuse = async (cookieToken: string): Promise<void> => {
  const payload = await verifyRefreshToken(cookieToken);
  const hackedUser = await getUserByUsernameService(payload.userInfo.username);
  await revokeAllUserTokensService(hackedUser.id);
};
