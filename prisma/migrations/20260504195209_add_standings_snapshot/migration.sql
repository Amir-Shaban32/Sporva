-- CreateTable
CREATE TABLE "Standings_Snapshot" (
    "team_id" TEXT NOT NULL,
    "season" TEXT NOT NULL,
    "matches_played" INTEGER NOT NULL DEFAULT 0,
    "wins" INTEGER NOT NULL DEFAULT 0,
    "draws" INTEGER NOT NULL DEFAULT 0,
    "losses" INTEGER NOT NULL DEFAULT 0,
    "goals_for" INTEGER NOT NULL DEFAULT 0,
    "goals_against" INTEGER NOT NULL DEFAULT 0,
    "points" INTEGER NOT NULL DEFAULT 0,
    "computed_at" TIMESTAMP(3) NOT NULL,
    "is_live" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Standings_Snapshot_pkey" PRIMARY KEY ("season","team_id")
);

-- AddForeignKey
ALTER TABLE "Standings_Snapshot" ADD CONSTRAINT "Standings_Snapshot_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "Teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
