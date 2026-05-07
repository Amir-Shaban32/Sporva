import { InputJsonValue } from "../../../generated/prisma/runtime/client";
import { prisma } from "../../lib/prisma";
import { ICreateRefreshToken } from "../../types";
import { NotFoundError } from "../../errors/app-error";
import { isPrismaError } from "../../utils/check-prisma-error";

class RefreshTokenRepository {
  async createToken(data: ICreateRefreshToken) {
    return await prisma.refresh_Tokens.create({
      data: {
        user_id: data.user_id,
        token: data.token,
        expires_at: data.expires_at,
        last_used: data.last_used,
        device_info: data.device_info as unknown as InputJsonValue,
        is_revoked: data.is_revoked,
      },
    });
  }

  async findTokenByToken(token: string) {
    return await prisma.refresh_Tokens.findUnique({ where: { token } });
  }
  async findTokenById(id: string) {
    return await prisma.refresh_Tokens.findUnique({ where: { id } });
  }

  async findTokenByUserId(user_id: string) {
    return await prisma.refresh_Tokens.findMany({ where: { user_id } });
  }

  async findUserByToken(token: string) {
    return await prisma.refresh_Tokens.findMany({
      where: { token },
      select: {
        user_id: true,
      },
    });
  }

  async revoke(user_id: string) {
    return await prisma.refresh_Tokens.updateMany({
      where: { user_id },
      data: { is_revoked: true },
    });
  }

  async delete(id: string) {
    try {
      return await prisma.refresh_Tokens.delete({ where: { id } });
    } catch (error) {
      if (isPrismaError(error) && error.code === "P2025") {
        throw new NotFoundError("Token not found");
      }
      throw error;
    }
  }
}

export const refreshTokenRepository = new RefreshTokenRepository();
