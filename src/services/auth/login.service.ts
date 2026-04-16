import { userRepository } from "../../repositories";
import {
  createTokenService,
  getTokenByToken,
  revokeAllUserTokensService,
  deleteTokenService,
} from "./refresh-token.service";
import { comparePassword } from "../../utils/password";
import { generateTokens } from "../../utils/jwt";
import { LoginInput, LoginResult } from "../../types/auth.type";
import {
  NotFoundError,
  UnauthorizedError,
  ServerError,
} from "../../errors/app-error";

export const loginService = async (input: LoginInput): Promise<LoginResult> => {
  const { username, password, deviceInfo, incomingCookieToken } = input;
  const foundUser = await userRepository.findByUsernameWithPassword(username);
  if (!foundUser) {
    throw new NotFoundError("User not found!");
  }

  const validPassword = await comparePassword(password, foundUser.password);
  if (!validPassword) {
    throw new UnauthorizedError("Invalid password");
  }

  const userPayload = {
    username: foundUser.username,
    role: foundUser.role,
    id: foundUser.id,
  };
  const { accessToken, refreshToken } = generateTokens(userPayload);

  if (incomingCookieToken) {
    try {
      const foundToken = await getTokenByToken(incomingCookieToken);
      await deleteTokenService(foundToken.id);
    } catch (error) {
      // Token not found or error, revoke all user tokens
      await revokeAllUserTokensService(foundUser.id);
    }
  }

  const newToken = await createTokenService({
    user_id: foundUser.id,
    token: refreshToken,
    expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000),
    last_used: new Date(),
    device_info: JSON.parse(JSON.stringify(deviceInfo)),
  });

  return { accessToken, refreshToken };
};
