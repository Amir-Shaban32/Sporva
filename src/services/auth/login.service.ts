import { userRepository } from "../../repositories";
import {
  createTokenService,
  getTokenByTokenService,
  revokeAllUserTokensService,
  deleteTokenService,
} from "./refresh-token.service";
import { comparePassword } from "../../utils/password";
import { generateTokens } from "../../utils/jwt";
import { LoginInput, LoginResult } from "../../types/auth.type";
import { NotFoundError, UnauthorizedError } from "../../errors/app-error";

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
      const foundToken = await getTokenByTokenService(incomingCookieToken);
      await deleteTokenService(foundToken.id);
    } catch (error) {
      if (error instanceof NotFoundError) {
        // token not in DB — possible reuse attack, revoke all
        await revokeAllUserTokensService(foundUser.id);
      } else {
        throw error;
      }
    }
  }

  await createTokenService({
    user_id: foundUser.id,
    token: refreshToken,
    expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000),
    last_used: new Date(),
    device_info: structuredClone(deviceInfo),
  });

  return { accessToken, refreshToken };
};
