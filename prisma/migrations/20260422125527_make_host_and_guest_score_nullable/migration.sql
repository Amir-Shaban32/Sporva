-- AlterTable
ALTER TABLE "Matches" ALTER COLUMN "host_team_score" DROP NOT NULL,
ALTER COLUMN "guest_team_score" DROP NOT NULL;
