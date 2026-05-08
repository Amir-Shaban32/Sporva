import { hashPassword } from "@shared/utils/password";
import { createUserService } from "@domains/user/user.service";
import { ICreateUser, IUser } from "@domains/user/user.types";

export const registerService = async (data: ICreateUser): Promise<IUser> => {
  const hashedPassword = await hashPassword(data.password);
  const userData = { ...data, password: hashedPassword };

  const user = await createUserService(userData);
  return user;
};
