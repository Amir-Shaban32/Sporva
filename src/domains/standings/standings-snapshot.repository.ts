import { prisma } from "@shared/lib/prisma";
import { SnapshotRow, IStandingSnapshot } from "./standings.types";

class StandingsSnapshotRepository {
  async findBySeason(season: string) {
    return await prisma.standings_Snapshot.findMany({
      where: { season },
      orderBy: { points: "desc" },
    });
  }

  async findBySeasonOnOrderBy(
    season: string,
    orderBy: Record<string, "desc" | "asc">,
  ) {
    return await prisma.standings_Snapshot.findMany({
      where: { season },
      orderBy,
    });
  }

  async upsertMany(records: SnapshotRow[]) {
    return await prisma.$transaction(
      records.map((record) =>
        prisma.standings_Snapshot.upsert({
          where: {
            season_team_id: { team_id: record.team_id, season: record.season },
          },
          create: { ...record },
          update: { ...record },
        }),
      ),
    );
  }

  async findBySeasonOrderByGoalDifference(season: string) {
    return await prisma.$queryRaw<IStandingSnapshot[]>`
    SELECT * FROM "Standings_Snapshot"
    WHERE season = ${season}
    ORDER BY (goals_for - goals_against) DESC
  `;
  }
}

export const standingsSnapshotRepository = new StandingsSnapshotRepository();
