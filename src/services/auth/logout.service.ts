import { LogoutInput } from "../../types";
import { deleteTokenService, getTokenByToken } from "./refresh-token.service";
import { BadRequestError, NotFoundError } from "../../errors/app-error";

export const logoutService = async (input: LogoutInput): Promise<string> => {
  const token = input.cookieToken;
  if (!token) {
    throw new BadRequestError("No token!");
  }

  const foundToken = await getTokenByToken(token);
  if (!foundToken) {
    throw new NotFoundError("Token not found!");
  }

  await deleteTokenService(foundToken.id);

  return "Logged out successfully";
};
