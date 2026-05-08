import { refreshTokenRepository } from "./refresh-token.repository";
import { NotFoundError } from "@shared/errors/app-error";
import {
  ICreateRefreshToken,
  IRefreshToken,
  IUserId,
} from "@shared/types/refresh-token.type";

export const createTokenService = async (
  data: ICreateRefreshToken,
): Promise<IRefreshToken> => {
  const refreshToken = await refreshTokenRepository.createToken(data);
  return refreshToken;
};

export const getTokenByIdService = async (
  id: string,
): Promise<IRefreshToken> => {
  const refreshToken = await refreshTokenRepository.findTokenById(id);

  if (!refreshToken) throw new NotFoundError("Refresh token not found");
  return refreshToken;
};

export const getTokenByTokenService = async (
  token: string,
): Promise<IRefreshToken> => {
  const refreshToken = await refreshTokenRepository.findTokenByToken(token);

  if (!refreshToken) throw new NotFoundError("Refresh token not found");
  return refreshToken;
};

export const getRefreshTokenByUserIdService = async (
  user_id: string,
): Promise<IRefreshToken[]> => {
  const refreshToken = await refreshTokenRepository.findTokenByUserId(user_id);
  if (!refreshToken)
    throw new NotFoundError("No refresh tokens found for user");
  return refreshToken;
};

export const getUserIdByRefreshTokenService = async (
  user_id: string,
): Promise<IUserId[]> => {
  const user = await refreshTokenRepository.findUserByToken(user_id);
  if (!user) throw new NotFoundError("User not found");
  return user;
};

export const revokeAllUserTokensService = async (
  user_id: string,
): Promise<void> => {
  await refreshTokenRepository.revoke(user_id);
};

export const deleteTokenService = async (id: string): Promise<void> => {
  await refreshTokenRepository.delete(id);
};
