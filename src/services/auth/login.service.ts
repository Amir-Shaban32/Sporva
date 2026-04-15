import { userRepository } from "../../repositories";
import { ServiceResult } from "../../types";
import {
  createTokenService,
  getTokenByToken,
  revokeAllUserTokensService,
  deleteTokenService,
} from "./refresh-token.service";
import { comparePassword } from "../../utils/password";
import { generateTokens } from "../../utils/jwt";
import { LoginInput, LoginResult } from "../../types/auth.type";

export const loginService = async (
  input: LoginInput,
): Promise<ServiceResult<LoginResult>> => {
  try {
    const { username, password, deviceInfo, incomingCookieToken } = input;
    const foundUser = await userRepository.findByUsernameWithPassword(username);
    if (!foundUser)
      return { success: false, error: "User not found!", code: "NOT_FOUND" };

    const validPassword = await comparePassword(password, foundUser.password);
    if (!validPassword)
      return {
        success: false,
        error: "Invalid password",
        code: "UNAUTHORIZED",
      };

    const userPayload = {
      username: foundUser.username,
      role: foundUser.role,
      id: foundUser.id,
    };
    const { accessToken, refreshToken } = generateTokens(userPayload);

    if (incomingCookieToken) {
      const foundToken = await getTokenByToken(incomingCookieToken);
      if (!foundToken.success) await revokeAllUserTokensService(foundUser.id);
      else await deleteTokenService(foundToken.data.id);
    }

    const newToken = await createTokenService({
      user_id: foundUser.id,
      token: refreshToken,
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000),
      last_used: new Date(),
      device_info: JSON.parse(JSON.stringify(deviceInfo)),
    });

    if (!newToken.success) {
      return {
        success: false,
        error: "Failed to create session",
        code: "DB_ERROR",
      };
    }

    return {
      success: true,
      data: { accessToken, refreshToken },
    };
  } catch (error) {
    return { success: false, code: "DB_ERROR", error: "Database error" };
  }
};
