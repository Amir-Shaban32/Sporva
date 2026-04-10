import { prisma } from "../lib/prisma";
import { Prisma } from "../../generated/prisma";
import { Imanager } from "../types/manager.type";

export class ManagerRepository {
  async create(data: Imanager) {
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

  async findByName(name: { f_name?: string; l_name?: string }) {
    return await prisma.managers.findMany({
      where: { first_name: name.f_name, last_name: name.l_name },
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
    return await prisma.managers.delete({
      where: { id },
    });
  }

  async count() {
    return await prisma.managers.count();
  }
}

export const managerRepository = new ManagerRepository();
