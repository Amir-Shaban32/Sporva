import { userRepository } from "../repositories";
import { IUser, ICreateUser } from "../types";
import { Prisma } from "../../generated/prisma";
import {
  ConflictError,
  NotFoundError,
  UnprocessableEntityError,
} from "../errors/app-error";
import { hashPassword } from "../utils/password";

export const createUserService = async (data: ICreateUser): Promise<IUser> => {
  const existing = await userRepository.findByUsername(data.username);
  if (existing) {
    throw new ConflictError("Username already exists");
  }

  const existingEmail = await userRepository.findByEmail(data.email);
  if (existingEmail) {
    throw new ConflictError("Email already exists");
  }

  const hashedPassword = await hashPassword(data.password);
  data.password = hashedPassword;

  const user = await userRepository.create(data);
  return user;
};

export const getUserByIdService = async (id: string): Promise<IUser> => {
  const user = await userRepository.findById(id);
  if (!user) {
    throw new NotFoundError("User not found");
  }
  return user;
};

export const getUserByUsernameService = async (
  username: string,
): Promise<IUser> => {
  const user = await userRepository.findByUsername(username);
  if (!user) {
    throw new NotFoundError("User not found");
  }
  return user;
};

export const getUserByEmailService = async (email: string): Promise<IUser> => {
  const user = await userRepository.findByEmail(email);
  if (!user) {
    throw new NotFoundError("User not found");
  }
  return user;
};

export const getAllUsersService = async (
  page: number = 1,
  limit: number = 10,
): Promise<{ users: IUser[]; total: number } | null> => {
  const total = await userRepository.count();

  if (total > 0 && page > Math.ceil(total / limit)) {
    throw new UnprocessableEntityError(
      `Page ${page} does not exist. Total pages: ${Math.ceil(total / limit)}`,
    );
  }

  const users = await userRepository.findAll(page, limit);
  if (!users.length) return null;
  return { users, total };
};

export const updateUserService = async (
  id: string,
  data: Prisma.UserUpdateInput,
): Promise<IUser> => {
  const user = await userRepository.update(id, data);
  return user;
};

export const deleteUserService = async (id: string): Promise<void> => {
  await userRepository.delete(id);
};

export const countUsersService = async (): Promise<number> => {
  const count = await userRepository.count();
  return count;
};
