import { LogoutInput } from "@shared/types/auth.type";
import {
  deleteTokenService,
  getTokenByTokenService,
} from "./refresh-token.service";
import { BadRequestError, NotFoundError } from "@shared/errors/app-error";

export const logoutService = async (input: LogoutInput): Promise<void> => {
  const token = input.cookieToken;
  if (!token) {
    throw new BadRequestError("No token!");
  }

  const foundToken = await getTokenByTokenService(token);
  if (!foundToken) {
    throw new NotFoundError("Token not found!");
  }

  await deleteTokenService(foundToken.id);
};
