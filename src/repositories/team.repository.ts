import { prisma } from "../lib/prisma";
import { Prisma } from "../../generated/prisma";
import { ICreateTeam } from "../types";

class TeamRepository {
  async create(data: ICreateTeam) {
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

  async findById(id: string) {
    return await prisma.teams.findUnique({
      where: { id },
    });
  }

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    return await prisma.teams.findMany({
      skip,
      take: limit,
    });
  }

  async findByName(name: string) {
    return await prisma.teams.findUnique({
      where: { name },
    });
  }

  async findByCity(city: string) {
    return await prisma.teams.findMany({
      where: { city },
    });
  }

  async update(id: string, data: Prisma.TeamsUpdateInput) {
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
