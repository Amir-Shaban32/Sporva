import { prisma } from "../lib/prisma";
import { ICreateManagerContract } from "../types";

class ManagerContractRepository {
  async create(data: ICreateManagerContract) {
    return await prisma.manager_Contracts.create({
      data: {
        manager_id: data.manager_id,
        team_id: data.team_id,
        start_date: data.start_date,
        end_date: data.end_date,
        annual_salary: data.annual_salary,
        is_active: data?.is_active ?? true,
      },
    });
  }

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    return await prisma.manager_Contracts.findMany({
      skip,
      take: limit,
    });
  }

  async findByManager(manager_id: string) {
    return await prisma.manager_Contracts.findMany({
      where: { manager_id },
    });
  }

  async findByManagerAndTeam(manager_id: string, team_id: string) {
    return await prisma.manager_Contracts.findMany({
      where: {
        manager_id,
        team_id,
      },
    });
  }

  async findActiveContracts() {
    return await prisma.manager_Contracts.findMany({
      where: { is_active: true },
    });
  }

  async findExpiredContracts() {
    return await prisma.manager_Contracts.findMany({
      where: { is_active: false },
    });
  }

  async findByInterval(periodInDays: number) {
    return await prisma.$queryRaw`
        SELECT *
        FROM "Manager_Contracts"
        WHERE EXTRACT(EPOCH FROM ("end_date" - "start_date")) / 86400
        BETWEEN ${periodInDays - 1} AND ${periodInDays + 1}
    `;
  }

  async deActivate(id: string) {
    return await prisma.manager_Contracts.update({
      where: { id },
      data: {
        is_active: false,
      },
    });
  }

  async count() {
    return await prisma.manager_Contracts.count();
  }
}

export const managerContractRepository = new ManagerContractRepository();
