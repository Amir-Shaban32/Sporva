import { prisma } from "../lib/prisma";
import { Competitions, Match_status, Prisma } from "../../generated/prisma";
import { ICreateMatch } from "../types";

class MatchRepository {
  async schedule(data: ICreateMatch) {
    const year = new Date().getFullYear();
    const season_matching = `${year}-${year + 1}`;
    return await prisma.matches.create({
      data: {
        season: data.season ?? season_matching,
        round: data.round,
        stadium: data.stadium,
        host_team_id: data.host_team_id,
        guest_team_id: data.guest_team_id,
        match_time: data.match_time,
        competition: data.competition,
        status: data.status,
        host_team_score: data.host_team_score ?? 0,
        guest_team_score: data.guest_team_score ?? 0,
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

  async update(id: string, data: Prisma.UserUpdateInput) {
    return await prisma.matches.update({
      where: { id },
      data: data,
    });
  }
}

export const matchRepository = new MatchRepository();
