import { hashPassword } from "../../utils/password";
import { createUserService, getUserByUsernameService } from "../user.service";
import { ServiceResult, ICreateUser, IUser } from "../../types";

export const registerService = async (
  data: ICreateUser,
): Promise<ServiceResult<IUser>> => {
  try {
    const existing = await getUserByUsernameService(data.username);
    if (existing.success)
      return {
        success: false,
        error: "User already exists!",
        code: "CONFLICT",
      };

    const hashedPassword = await hashPassword(data.password);
    const userData = { ...data, password: hashedPassword };

    const user = await createUserService(userData);
    if (!user.success)
      return {
        success: false,
        error: user.error,
        code: user.code ?? "DB_ERROR",
      };

    return { success: true, data: user.data };
  } catch (error) {
    return { success: false, code: "DB_ERROR", error: "Database error" };
  }
};
