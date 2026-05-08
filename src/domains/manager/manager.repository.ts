import { prisma } from "@shared/lib/prisma";
import { Prisma } from "@generated/prisma";
import { ICreateManager, ManagerSearchInput } from "./manager.types";
import { NotFoundError } from "@shared/errors/app-error";
import { isPrismaError } from "@shared/utils/check-prisma-error";

export class ManagerRepository {
  async create(data: ICreateManager) {
    return await prisma.managers.create({
      data: {
        first_name: data?.first_name,
        last_name: data.last_name,
        birth_date: data.birth_date,
        nationality: data.nationality,
        is_retired: data.is_retired,
        retired_date: data.is_retired ? data.retired_date : null,
      },
    });
  }

  async findByName(name: ManagerSearchInput) {
    return await prisma.managers.findMany({
      where: { first_name: name.f_name, last_name: name.l_name },
    });
  }

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    return await prisma.managers.findMany({
      skip,
      take: limit,
    });
  }

  async findById(id: string) {
    return await prisma.managers.findUnique({
      where: { id },
    });
  }
  async findByNameAndBirthDate(
    first_name: string | null,
    last_name: string,
    birth_date: Date,
  ) {
    return await prisma.managers.findFirst({
      where: { first_name, last_name, birth_date },
    });
  }

  async findByNationality(nationality: string) {
    return await prisma.managers.findMany({
      where: { nationality },
    });
  }

  async update(id: string, data: Prisma.UserUpdateInput) {
    return await prisma.managers.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    try {
      return await prisma.managers.delete({
        where: { id },
      });
    } catch (error) {
      if (isPrismaError(error) && error.code === "P2025") {
        throw new NotFoundError("Manager not found");
      }
      throw error;
    }
  }

  async count() {
    return await prisma.managers.count();
  }
}

export const managerRepository = new ManagerRepository();
