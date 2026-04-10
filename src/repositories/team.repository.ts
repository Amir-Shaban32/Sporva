import { prisma } from "../lib/prisma";
import { Prisma } from "../../generated/prisma";
import { Iteam } from "../types/team.type";

class TeamRepository {
  async create(data: Iteam) {
    return await prisma.teams.create({
      data: {
        name: data.name,
        founded_year: data.founded_year,
        city: data.city,
        stadium: data.stadium,
        current_manager_id: data.current_manager_id,
      },
    });
  }

  async findByName(name: string) {
    return await prisma.teams.findMany({
      where: { name },
    });
  }

  async findByCity(city: string) {
    return await prisma.teams.findMany({
      where: { city },
    });
  }

  async update(id: string, data: Prisma.UserUpdateInput) {
    return await prisma.teams.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return await prisma.teams.delete({
      where: { id },
    });
  }

  async count() {
    return await prisma.teams.count();
  }
}

export const teamRepository = new TeamRepository();
