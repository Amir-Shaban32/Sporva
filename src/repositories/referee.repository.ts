import { prisma } from "../lib/prisma";
import { Prisma } from "../../generated/prisma";
import { Ireferee } from "../types/referee.type";

class RefereeRepository {
  async create(data: Ireferee) {
    return await prisma.referees.create({
      data: {
        first_name: data?.first_name,
        last_name: data.last_name,
        birth_date: data.birth_date,
        nationality: data.nationality,
        is_retired: data?.is_retired,
        retired_date: data.is_retired ? data.retired_date : null,
      },
    });
  }

  async findByName(name: { f_name?: string; l_name?: string }) {
    return await prisma.referees.findMany({
      where: { first_name: name.f_name, last_name: name.l_name },
    });
  }

  async findByNationality(nationality: string) {
    return await prisma.referees.findMany({
      where: { nationality },
    });
  }

  async update(id: string, data: Prisma.UserUpdateInput) {
    return await prisma.referees.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return await prisma.referees.delete({
      where: { id },
    });
  }

  async count() {
    return await prisma.referees.count();
  }
}

export const refereeRepository = new RefereeRepository();
