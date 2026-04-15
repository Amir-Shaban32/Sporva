import { prisma } from "../lib/prisma";
import { ILeagueStanding } from "../types";

interface MatchResult {
  won: boolean;
  drew: boolean;
  goals_for: number;
  goals_against: number;
}

class LeagueStandingsRepository {
  async tableOrder(season?: string) {
    let curr_season;
    if (season) {
      curr_season = season;
    } else {
      const year = new Date().getFullYear();
      curr_season = `${year}-${year + 1}`;
    }

    return await prisma.$queryRaw<ILeagueStanding[]>`
            SELECT *
            FROM "League_Standings"
            WHERE "season" = ${curr_season}
            ORDER BY "points" DESC
        `;
  }

  async tableOrderByMostWins(season?: string) {
    let curr_season;
    if (season) {
      curr_season = season;
    } else {
      const year = new Date().getFullYear();
      curr_season = `${year}-${year + 1}`;
    }

    return await prisma.$queryRaw<ILeagueStanding[]>`
            SELECT *
            FROM "League_Standings"
            WHERE "season" = ${curr_season}
            ORDER BY "wins" DESC
        `;
  }

  async tableOrderByMostDraws(season?: string) {
    let curr_season;
    if (season) {
      curr_season = season;
    } else {
      const year = new Date().getFullYear();
      curr_season = `${year}-${year + 1}`;
    }

    return await prisma.$queryRaw<ILeagueStanding[]>`
            SELECT *
            FROM "League_Standings"
            WHERE "season" = ${curr_season}
            ORDER BY "draws" DESC
        `;
  }

  async tableOrderByLeastLoses(season?: string) {
    let curr_season;
    if (season) {
      curr_season = season;
    } else {
      const year = new Date().getFullYear();
      curr_season = `${year}-${year + 1}`;
    }

    return await prisma.$queryRaw<ILeagueStanding[]>`
            SELECT *
            FROM "League_Standings"
            WHERE "season" = ${curr_season}
            ORDER BY "losses"
        `;
  }

  async tableOrderByMostGoalsFor(season?: string) {
    let curr_season;
    if (season) {
      curr_season = season;
    } else {
      const year = new Date().getFullYear();
      curr_season = `${year}-${year + 1}`;
    }

    return await prisma.$queryRaw<ILeagueStanding[]>`
            SELECT *
            FROM "League_Standings"
            WHERE "season" = ${curr_season}
            ORDER BY "goals_for" DESC
        `;
  }

  async tableOrderByLeastGoalsAgainst(season?: string) {
    let curr_season;
    if (season) {
      curr_season = season;
    } else {
      const year = new Date().getFullYear();
      curr_season = `${year}-${year + 1}`;
    }

    return await prisma.$queryRaw<ILeagueStanding[]>`
            SELECT *
            FROM "League_Standings"
            WHERE "season" = ${curr_season}
            ORDER BY "goals_against" DESC
        `;
  }

  async tableOrderByGoalsDifference(season?: string) {
    let curr_season;
    if (season) {
      curr_season = season;
    } else {
      const year = new Date().getFullYear();
      curr_season = `${year}-${year + 1}`;
    }

    return await prisma.$queryRaw<ILeagueStanding[]>`
            SELECT *
            FROM "League_Standings"
            WHERE "season" = ${curr_season}
            ORDER BY "goals_for"-"goals_against" DESC
        `;
  }

  async updateAfterMatch(team_id: string, season: string, result: MatchResult) {
    return await prisma.league_Standings.upsert({
      where: { season_team_id: { team_id, season } },
      create: {
        team_id,
        season,
        matches_played: 1,
        wins: result.won ? 1 : 0,
        draws: result.drew ? 1 : 0,
        losses: !result.won && !result.drew ? 1 : 0,
        goals_for: result.goals_for,
        goals_against: result.goals_against,
        points: result.won ? 3 : result.drew ? 1 : 0,
      },
      update: {
        matches_played: { increment: 1 },
        wins: result.won ? { increment: 1 } : undefined,
        draws: result.drew ? { increment: 1 } : undefined,
        losses: !result.won && !result.drew ? { increment: 1 } : undefined,
        goals_for: { increment: result.goals_for },
        goals_against: { increment: result.goals_against },
        points: { increment: result.won ? 3 : result.drew ? 1 : 0 },
      },
    });
  }
}

export const leagueStandingsRepository = new LeagueStandingsRepository();
