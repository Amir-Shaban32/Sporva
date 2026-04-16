import { hashPassword } from "../../utils/password";
import { createUserService, getUserByUsernameService } from "../user.service";
import { ICreateUser, IUser } from "../../types";
import { ConflictError } from "../../errors/app-error";

export const registerService = async (data: ICreateUser): Promise<IUser> => {
  try {
    await getUserByUsernameService(data.username);
    throw new ConflictError("User already exists!");
  } catch (error: any) {
    // Expected: user not found, continue
    if (
      !(error instanceof ConflictError) &&
      error.message !== "User not found"
    ) {
      throw error;
    }
  }

  const hashedPassword = await hashPassword(data.password);
  const userData = { ...data, password: hashedPassword };

  const user = await createUserService(userData);
  return user;
};
