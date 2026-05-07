import { prisma } from "../lib/prisma";
import { Prisma } from "../../generated/prisma";
import { ICreateReferee, RefereeSearchInput } from "../types";
import { NotFoundError } from "../errors/app-error";
import { isPrismaError } from "../utils/check-prisma-error";

class RefereeRepository {
  async create(data: ICreateReferee) {
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

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    return await prisma.referees.findMany({
      skip,
      take: limit,
    });
  }
  async findById(id: string) {
    return await prisma.referees.findUnique({
      where: { id },
    });
  }

  async findByName(name: RefereeSearchInput) {
    return await prisma.referees.findMany({
      where: { first_name: name.f_name, last_name: name.l_name },
    });
  }

  async findByNationality(nationality: string) {
    return await prisma.referees.findMany({
      where: { nationality },
    });
  }

  async findByNameAndBirthDate(
    first_name: string | null,
    last_name: string,
    birth_date: Date,
  ) {
    return await prisma.referees.findFirst({
      where: { first_name, last_name, birth_date },
    });
  }

  async update(id: string, data: Prisma.UserUpdateInput) {
    try {
      return await prisma.referees.update({
        where: { id },
        data,
      });
    } catch (error) {
      if (isPrismaError(error) && error.code === "P2025") {
        throw new NotFoundError("Referee not found");
      }
      throw error;
    }
  }

  async delete(id: string) {
    try {
      return await prisma.referees.delete({
        where: { id },
      });
    } catch (error) {
      if (isPrismaError(error) && error.code === "P2025") {
        throw new NotFoundError("Referee not found");
      }
      throw error;
    }
  }

  async count() {
    return await prisma.referees.count();
  }
}

export const refereeRepository = new RefereeRepository();
