import { prisma } from "@shared/lib/prisma";
import { Prisma, User_Role } from "@generated/prisma";
import { ICreateUser } from "./user.types";
import { NotFoundError } from "@shared/errors/app-error";
import { isPrismaError } from "@shared/utils/check-prisma-error";

class UserRepository {
  async create(data: ICreateUser) {
    return await prisma.user.create({
      data: {
        username: data.username,
        email: data.email,
        password: data.password,
        role: data.role || User_Role.USER,
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        created_at: true,
        updated_at: true,
      },
    });
  }

  async findById(id: string) {
    return await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        created_at: true,
        updated_at: true,
      },
    });
  }

  async findAdmin() {
    return await prisma.user.findMany({ where: { role: User_Role.ADMIN } });
  }

  async findByUsername(username: string) {
    return await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        created_at: true,
        updated_at: true,
      },
    });
  }

  async findByUsernameWithPassword(username: string) {
    return await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        password: true,
        created_at: true,
        updated_at: true,
      },
    });
  }

  async findByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        created_at: true,
        updated_at: true,
      },
    });
  }

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    return await prisma.user.findMany({
      skip,
      take: limit,
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        created_at: true,
        updated_at: true,
      },
    });
  }

  async update(id: string, data: Prisma.UserUpdateInput) {
    try {
      return await prisma.user.update({
        where: { id },
        data,
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
          created_at: true,
          updated_at: true,
        },
      });
    } catch (error) {
      if (isPrismaError(error) && error.code === "P2025") {
        throw new NotFoundError("User not found");
      }
      throw error;
    }
  }

  async delete(id: string) {
    try {
      return await prisma.user.delete({
        where: { id },
      });
    } catch (error) {
      if (isPrismaError(error) && error.code === "P2025") {
        throw new NotFoundError("User not found");
      }
      throw error;
    }
  }

  async count() {
    return await prisma.user.count();
  }
}
export const userRepository = new UserRepository();
