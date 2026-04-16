import { refreshTokenRepository } from "../../repositories";
import { NotFoundError, ServerError } from "../../errors/app-error";
import {
  ICreateRefreshToken,
  IRefreshToken,
  IUserId,
} from "../../types/refresh-token.type";

export const createTokenService = async (
  data: ICreateRefreshToken,
): Promise<IRefreshToken> => {
  try {
    const refreshToken = await refreshTokenRepository.createToken(data);
    return refreshToken;
  } catch (error) {
    throw new ServerError("Failed to create refresh token");
  }
};

export const getTokenById = async (id: string): Promise<IRefreshToken> => {
  try {
    const refreshToken = await refreshTokenRepository.findTokenById(id);

    if (!refreshToken) throw new NotFoundError("Refresh token not found");
    return refreshToken;
  } catch (error) {
    if (error instanceof NotFoundError) throw error;
    throw new ServerError("Failed to retrieve refresh token");
  }
};

export const getTokenByToken = async (
  token: string,
): Promise<IRefreshToken> => {
  try {
    const refreshToken = await refreshTokenRepository.findTokenByToken(token);

    if (!refreshToken) throw new NotFoundError("Refresh token not found");
    return refreshToken;
  } catch (error) {
    if (error instanceof NotFoundError) throw error;
    throw new ServerError("Failed to retrieve refresh token");
  }
};

export const getRefreshTokenByUserIdService = async (
  user_id: string,
): Promise<IRefreshToken[]> => {
  try {
    const refreshToken =
      await refreshTokenRepository.findTokenByUserId(user_id);
    if (!refreshToken)
      throw new NotFoundError("No refresh tokens found for user");
    return refreshToken;
  } catch (error) {
    if (error instanceof NotFoundError) throw error;
    throw new ServerError("Failed to retrieve refresh tokens");
  }
};

export const getUserIdByRefreshTokenService = async (
  user_id: string,
): Promise<IUserId[]> => {
  try {
    const user = await refreshTokenRepository.findUserByToken(user_id);
    if (!user) throw new NotFoundError("User not found");
    return user;
  } catch (error) {
    if (error instanceof NotFoundError) throw error;
    throw new ServerError("Failed to retrieve user");
  }
};

export const revokeAllUserTokensService = async (
  user_id: string,
): Promise<void> => {
  try {
    await refreshTokenRepository.revoke(user_id);
  } catch (error) {
    throw new ServerError("Failed to revoke user tokens");
  }
};

export const deleteTokenService = async (id: string): Promise<string> => {
  try {
    const existing = await refreshTokenRepository.findTokenById(id);
    if (!existing) throw new NotFoundError("Refresh token not found");
    await refreshTokenRepository.delete(id);
    return "Refresh token deleted successfully";
  } catch (error) {
    if (error instanceof NotFoundError) throw error;
    throw new ServerError("Failed to delete refresh token");
  }
};
