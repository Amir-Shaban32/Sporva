import { prisma } from "@shared/lib/prisma";
import { ICreateMatchReferee } from "./match-referee.types";
import { NotFoundError } from "@shared/errors/app-error";
import { isPrismaError } from "@shared/utils/check-prisma-error";

class MatchRefereeRepository {
  async assign(data: ICreateMatchReferee) {
    return await prisma.match_Referees.create({
      data: {
        match_id: data.match_id,
        referee_id: data.referee_id,
        role: data.role,
      },
    });
  }

  async findByRefereeAndMatch(referee_id: string, match_id: string) {
    return await prisma.match_Referees.findFirst({
      where: { referee_id, match_id },
    });
  }

  async findByMatch(match_id: string) {
    return await prisma.match_Referees.findMany({
      where: { match_id },
    });
  }

  async findByReferee(referee_id: string) {
    return await prisma.match_Referees.findMany({
      where: { referee_id },
    });
  }

  async unAssign(composite_id: ICreateMatchReferee) {
    try {
      return await prisma.match_Referees.delete({
        where: {
          match_id_referee_id_role: {
            referee_id: composite_id.referee_id,
            match_id: composite_id.match_id,
            role: composite_id.role,
          },
        },
      });
    } catch (error) {
      if (isPrismaError(error) && error.code === "P2025") {
        throw new NotFoundError("Match Referee record not found");
      }
      throw error;
    }
  }
}

export const matchRefereeRepository = new MatchRefereeRepository();
