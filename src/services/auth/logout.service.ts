import { LogoutInput, ServiceResult } from "../../types";
import { deleteTokenService, getTokenByToken } from "./refreshToken.service";

export const logoutService = async (
  input: LogoutInput,
): Promise<ServiceResult<string>> => {
  try {
    const token = input.cookieToken;
    if (!token)
      return { success: false, error: "No token!", code: "NO_CONTENT" };

    const foundToken = await getTokenByToken(token);
    if (!foundToken.success)
      return { success: false, error: "Not found!", code: "NOT_FOUND" };

    await deleteTokenService(foundToken.data.id);

    return { success: true, data: "Logged out successfully" };
  } catch (error) {
    return { success: false, code: "DB_ERROR", error: "Database error" };
  }
};
