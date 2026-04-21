import { hashPassword } from "../../utils/password";
import { createUserService } from "../user.service";
import { ICreateUser, IUser } from "../../types";

export const registerService = async (data: ICreateUser): Promise<IUser> => {
  const hashedPassword = await hashPassword(data.password);
  const userData = { ...data, password: hashedPassword };

  const user = await createUserService(userData);
  return user;
};
