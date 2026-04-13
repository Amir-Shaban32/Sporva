import { refreshTokenRepository } from "../../repositories";
import { ServiceResult } from "../../types";
import {
  ICreateRefreshToken,
  IRefreshToken,
  IUserId,
} from "../../types/refresh-token.types";

export const createTokenService = async (
  data: ICreateRefreshToken,
): Promise<ServiceResult<IRefreshToken>> => {
  try {
    const refreshToken = await refreshTokenRepository.createToken(data);
    return { success: true, data: refreshToken };
  } catch (error) {
    return { success: false, code: "DB_ERROR", error: "Database error" };
  }
};

export const getTokenById = async (
  id: string,
): Promise<ServiceResult<IRefreshToken>> => {
  try {
    const refreshToken = await refreshTokenRepository.findTokenById(id);

    if (!refreshToken)
      return { success: false, error: "No token", code: "NOT_FOUND" };
    return { success: true, data: refreshToken };
  } catch (error) {
    return { success: false, code: "DB_ERROR", error: "Database error" };
  }
};

export const getTokenByToken = async (
  token: string,
): Promise<ServiceResult<IRefreshToken>> => {
  try {
    const refreshToken = await refreshTokenRepository.findTokenByToken(token);

    if (!refreshToken)
      return { success: false, error: "No token", code: "NOT_FOUND" };
    return { success: true, data: refreshToken };
  } catch (error) {
    return { success: false, code: "DB_ERROR", error: "Database error" };
  }
};

export const getRefreshTokenByUserIdService = async (
  user_id: string,
): Promise<ServiceResult<IRefreshToken[]>> => {
  try {
    const refreshToken =
      await refreshTokenRepository.findTokenByUserId(user_id);
    if (!refreshToken)
      return { success: false, error: "No token", code: "NOT_FOUND" };
    return { success: true, data: refreshToken };
  } catch (error) {
    return { success: false, code: "DB_ERROR", error: "Database error" };
  }
};

export const getUserIdByRefreshTokenService = async (
  user_id: string,
): Promise<ServiceResult<IUserId[]>> => {
  try {
    const user = await refreshTokenRepository.findUserByToken(user_id);
    if (!user) return { success: false, error: "No user", code: "NOT_FOUND" };
    return { success: true, data: user };
  } catch (error) {
    return { success: false, code: "DB_ERROR", error: "Database error" };
  }
};

export const revokeAllUserTokensService = async (user_id: string) => {
  try {
    await refreshTokenRepository.revoke(user_id);
  } catch (error) {
    return { success: false, code: "DB_ERROR", error: "Database error" };
  }
};

export const deleteTokenService = async (
  id: string,
): Promise<ServiceResult<string>> => {
  try {
    const existing = await refreshTokenRepository.findTokenById(id);
    if (!existing)
      return { success: false, error: "No token", code: "NOT_FOUND" };
    return { success: true, data: "deleted successfully" };
  } catch (error) {
    return { success: false, code: "DB_ERROR", error: "Database error" };
  }
};
