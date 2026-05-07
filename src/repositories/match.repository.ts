import { prisma } from "../lib/prisma";
import { Competitions, Match_status, Prisma } from "../../generated/prisma";
import { ICreateMatch } from "../types";
import { isPrismaError } from "../utils/check-prisma-error";
import { NotFoundError } from "../errors/app-error";

class MatchRepository {
  async schedule(data: ICreateMatch) {
    return await prisma.matches.create({
      data: {
        season: data.season!,
        round: data.round,
        stadium: data.stadium,
        host_team_id: data.host_team_id,
        guest_team_id: data.guest_team_id,
        match_time: data.match_time,
        competition: data.competition,
        status: data.status,
        host_team_score: data.host_team_score ?? null,
        guest_team_score: data.guest_team_score ?? null,
        got_extra_time: data?.got_extra_time,
        got_penalties: data?.got_penalties,
        host_penalty_score: data?.host_penalty_score,
        guest_penalty_score: data?.guest_penalty_score,
      },
    });
  }

  async findByTeam(team_id: string) {
    return await prisma.matches.findMany({
      where: {
        OR: [{ host_team_id: team_id }, { guest_team_id: team_id }],
      },
    });
  }

  async findById(id: string) {
    return await prisma.matches.findUnique({
      where: { id },
    });
  }

  async findLive() {
    return await prisma.matches.findMany({
      where: { status: "LIVE" },
    });
  }

  async findByStatus(status: Match_status) {
    return await prisma.matches.findMany({
      where: { status },
    });
  }

  async findBySeasonAndStatus(season: string, status: Match_status) {
    return await prisma.matches.findMany({
      where: { status, season },
    });
  }

  async findByComp(competition: Competitions) {
    return await prisma.matches.findMany({
      where: { competition },
    });
  }

  async findByDate(date: Date) {
    return await prisma.matches.findMany({
      where: { match_time: date },
    });
  }

  async findByRound(round: number) {
    return await prisma.matches.findMany({
      where: { round },
    });
  }

  async findBySeason(season: string) {
    return await prisma.matches.findMany({
      where: { season },
    });
  }

  async findGotExtra() {
    return await prisma.matches.findMany({
      where: { got_extra_time: true },
    });
  }

  async findGotPenalties() {
    return await prisma.matches.findMany({
      where: { got_penalties: true },
    });
  }

  async findByTeamsAndSeasonAndComp(
    season: string,
    guest_id: string,
    host_id: string,
    competition: Competitions,
  ) {
    return await prisma.matches.findFirst({
      where: {
        season,
        guest_team_id: guest_id,
        host_team_id: host_id,
        competition,
      },
    });
  }

  async update(id: string, data: Prisma.UserUpdateInput) {
    try {
      return await prisma.matches.update({
        where: { id },
        data: data,
      });
    } catch (error) {
      if (isPrismaError(error) && error.code === "P2025") {
        throw new NotFoundError("Match not found");
      }
      throw error;
    }
  }

  async updateStatus(id: string, tx: Prisma.TransactionClient = prisma) {
    try {
      return await tx.matches.update({
        where: { id },
        data: { status: "FINISHED" },
      });
    } catch (error) {
      if (isPrismaError(error) && error.code === "P2025") {
        throw new NotFoundError("Match not found");
      }
      throw error;
    }
  }

  async updateMatchStatus(id: string, status: Match_status) {
    try {
      return await prisma.matches.update({
        where: { id },
        data: {
          status,
          ...(status === "LIVE" && { host_team_score: 0, guest_team_score: 0 }),
        },
      });
    } catch (error) {
      if (isPrismaError(error) && error.code === "P2025") {
        throw new NotFoundError("Match not found");
      }
      throw error;
    }
  }
}

export const matchRepository = new MatchRepository();
