import { prisma } from "../lib/prisma";
import { ICreateMatchReferee } from "../types";

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
    return await prisma.match_Referees.delete({
      where: {
        match_id_referee_id_role: {
          referee_id: composite_id.referee_id,
          match_id: composite_id.match_id,
          role: composite_id.role,
        },
      },
    });
  }
}

export const matchRefereeRepository = new MatchRefereeRepository();
