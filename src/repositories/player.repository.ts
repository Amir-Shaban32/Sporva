import { prisma } from "../lib/prisma";
import { Prisma, Positions } from "../../generated/prisma";
import { Iplayer } from "../types/player.type";

class PlayerRepository {
  async create(data: Iplayer) {
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

  async findByName(name: { f_name?: string; l_name?: string }) {
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

  async update(id: string, data: Prisma.UserUpdateInput) {
    return await prisma.players.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return await prisma.players.delete({
      where: { id },
    });
  }

  async count() {
    return await prisma.players.count();
  }
}

export const playerRepository = new PlayerRepository();
