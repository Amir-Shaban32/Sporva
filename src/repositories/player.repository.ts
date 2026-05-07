import { prisma } from "../lib/prisma";
import { Prisma, Positions } from "../../generated/prisma";
import { ICreatePlayer, PlayerSearchInput } from "../types";
import { NotFoundError } from "../errors/app-error";
import { isPrismaError } from "../utils/check-prisma-error";

class PlayerRepository {
  async create(data: ICreatePlayer) {
    return await prisma.players.create({
      data: {
        first_name: data?.first_name,
        last_name: data.last_name,
        birth_date: data.birth_date,
        nationality: data.nationality,
        jersey_number: data.jersey_number,
        position: data.position,
        preferred_foot: data?.preferred_foot,
        joined_date: data.joined_date,
        team_id: data?.team_id,
        is_retired: data?.is_retired,
        retired_date: data.is_retired ? data.retired_date : null,
      },
    });
  }

  async findById(id: string) {
    return await prisma.players.findUnique({
      where: { id },
    });
  }

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    return await prisma.players.findMany({
      skip,
      take: limit,
    });
  }

  async findByName(name: PlayerSearchInput) {
    return await prisma.players.findMany({
      where: { first_name: name.f_name, last_name: name.l_name },
    });
  }

  async findByTeam(teamId: string) {
    return await prisma.players.findMany({
      where: { team_id: teamId },
    });
  }

  async findByPosition(position: string) {
    return await prisma.players.findMany({
      where: { position: position as Positions },
    });
  }

  async findByNationality(nationality: string) {
    return await prisma.players.findMany({
      where: { nationality },
    });
  }

  async findByJerseyAndTeam(jersey_number: number, team_id: string) {
    return await prisma.players.findFirst({
      where: { jersey_number, team_id },
    });
  }

  async update(id: string, data: Prisma.PlayersUpdateInput) {
    try {
      return await prisma.players.update({
        where: { id },
        data,
      });
    } catch (error) {
      if (isPrismaError(error) && error.code === "P2025") {
        throw new NotFoundError("Player not found");
      }
      throw error;
    }
  }

  async delete(id: string) {
    try {
      return await prisma.players.delete({
        where: { id },
      });
    } catch (error) {
      if (isPrismaError(error) && error.code === "P2025") {
        throw new NotFoundError("Player not found");
      }
      throw error;
    }
  }

  async count() {
    return await prisma.players.count();
  }
}

export const playerRepository = new PlayerRepository();
