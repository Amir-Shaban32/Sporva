import { prisma } from "../lib/prisma";
import { Prisma, User_Role } from "../../generated/prisma";
import { IUser } from "../types/user.type";

class UserRepository {
  async create(data: IUser) {
    return await prisma.user.create({
      data: {
        username: data.username,
        email: data.email,
        password: data.password,
        role: (data.role as User_Role) || User_Role.USER,
      },
    });
  }

  async findById(id: string) {
    return await prisma.user.findUnique({
      where: { id },
    });
  }

  async findByUsername(username: string) {
    return await prisma.user.findUnique({
      where: { username },
    });
  }

  async findByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email },
    });
  }

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    return await prisma.user.findMany({
      skip,
      take: limit,
      select: {
        username: true,
        role: true,
        created_at: true,
      },
    });
  }

  async update(id: string, data: Prisma.UserUpdateInput) {
    return await prisma.user.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return await prisma.user.delete({
      where: { id },
    });
  }

  async count() {
    return await prisma.user.count();
  }
}
export const userRepository = new UserRepository();
