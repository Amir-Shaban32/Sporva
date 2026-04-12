import { userRepository } from "../repositories";
import { ServiceResult, IUser, ICreateUser } from "../types";
import { Prisma } from "../../generated/prisma";

export const createUserService = async (
  data: ICreateUser,
): Promise<ServiceResult<IUser>> => {
  try {
    const existing = await userRepository.findByUsername(data.username);
    if (existing) {
      return {
        success: false,
        error: "Username already exists",
        code: "CONFLICT",
      };
    }

    const existingEmail = await userRepository.findByEmail(data.email);
    if (existingEmail) {
      return {
        success: false,
        error: "Email already exists",
        code: "CONFLICT",
      };
    }

    const user = await userRepository.create(data);
    return { success: true, data: user };
  } catch (error) {
    return { success: false, code: "DB_ERROR", error: "Database error" };
  }
};

export const getUserByIdService = async (
  id: string,
): Promise<ServiceResult<IUser>> => {
  try {
    const user = await userRepository.findById(id);
    if (!user) {
      return { success: false, error: "User not found", code: "NOT_FOUND" };
    }
    return { success: true, data: user };
  } catch (error) {
    return { success: false, code: "DB_ERROR", error: "Database error" };
  }
};

export const getUserByUsernameService = async (
  username: string,
): Promise<ServiceResult<IUser>> => {
  try {
    const user = await userRepository.findByUsername(username);
    if (!user) {
      return { success: false, error: "User not found", code: "NOT_FOUND" };
    }
    return { success: true, data: user };
  } catch (error) {
    return { success: false, code: "DB_ERROR", error: "Database error" };
  }
};

export const getUserByEmailService = async (
  email: string,
): Promise<ServiceResult<IUser>> => {
  try {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      return { success: false, error: "User not found", code: "NOT_FOUND" };
    }
    return { success: true, data: user };
  } catch (error) {
    return { success: false, code: "DB_ERROR", error: "Database error" };
  }
};

export const getAllUsersService = async (
  page: number = 1,
  limit: number = 10,
): Promise<ServiceResult<IUser[]>> => {
  try {
    const users = await userRepository.findAll(page, limit);
    if (!users.length) {
      return { success: false, error: "No users found", code: "NOT_FOUND" };
    }
    return { success: true, data: users };
  } catch (error) {
    return { success: false, code: "DB_ERROR", error: "Database error" };
  }
};

export const updateUserService = async (
  id: string,
  data: Prisma.UserUpdateInput,
): Promise<ServiceResult<IUser>> => {
  try {
    const existing = await userRepository.findById(id);
    if (!existing) {
      return { success: false, error: "User not found", code: "NOT_FOUND" };
    }
    const user = await userRepository.update(id, data);
    return { success: true, data: user };
  } catch (error) {
    return { success: false, code: "DB_ERROR", error: "Database error" };
  }
};

export const deleteUserService = async (
  id: string,
): Promise<ServiceResult<IUser>> => {
  try {
    const existing = await userRepository.findById(id);
    if (!existing) {
      return { success: false, error: "User not found", code: "NOT_FOUND" };
    }
    const user = await userRepository.delete(id);
    return { success: true, data: user };
  } catch (error) {
    return { success: false, code: "DB_ERROR", error: "Database error" };
  }
};

export const countUsersService = async (): Promise<ServiceResult<number>> => {
  try {
    const count = await userRepository.count();
    return { success: true, data: count };
  } catch (error) {
    return { success: false, code: "DB_ERROR", error: "Database error" };
  }
};
