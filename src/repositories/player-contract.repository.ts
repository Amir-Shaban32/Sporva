import { prisma } from "../lib/prisma";
import { ICreatePlayerContract } from "../types";

class PlayerContractRepository {
  async create(data: ICreatePlayerContract) {
    return await prisma.player_Contracts.create({
      data: {
        player_id: data.player_id,
        team_id: data.team_id,
        start_date: data.start_date,
        end_date: data.end_date,
        annual_salary: data.annual_salary,
        is_active: data?.is_active ?? true,
      },
    });
  }

  async findByPlayer(player_id: string) {
    return await prisma.player_Contracts.findMany({
      where: { player_id },
    });
  }

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    return await prisma.player_Contracts.findMany({
      skip,
      take: limit,
    });
  }

  async findActiveContracts() {
    return await prisma.player_Contracts.findMany({
      where: { is_active: true },
    });
  }

  async findExpiredContracts() {
    return await prisma.player_Contracts.findMany({
      where: { is_active: false },
    });
  }

  async findByInterval(period: number) {
    return await prisma.$queryRaw`
        SELECT *
        FROM "Player_Contracts"
        WHERE DATE_PART('day', "end_date" - "start_date") = ${period}
    `;
  }

  async deActivate(id: string) {
    return await prisma.player_Contracts.update({
      where: { id },
      data: {
        is_active: false,
      },
    });
  }

  async count() {
    return await prisma.player_Contracts.count();
  }
}

export const playerContractRepository = new PlayerContractRepository();
