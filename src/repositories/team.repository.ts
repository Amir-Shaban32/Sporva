import { prisma } from "../lib/prisma";
import { Prisma } from "../../generated/prisma";
import { ICreateTeam } from "../types";
import { isPrismaError } from "../utils/check-prisma-error";
import { NotFoundError } from "../errors/app-error";

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
    try {
      return await prisma.teams.update({
        where: { id },
        data,
      });
    } catch (error) {
      if (isPrismaError(error) && error.code === "P2025") {
        throw new NotFoundError("Team not found");
      }
      throw error;
    }
  }

  async delete(id: string) {
    try {
      return await prisma.teams.delete({
        where: { id },
      });
    } catch (error) {
      if (isPrismaError(error) && error.code === "P2025") {
        throw new NotFoundError("Team not found");
      }
      throw error;
    }
  }

  async count() {
    return await prisma.teams.count();
  }
}

export const teamRepository = new TeamRepository();
