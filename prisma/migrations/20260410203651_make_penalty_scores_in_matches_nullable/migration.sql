-- AlterTable
ALTER TABLE "Matches" ALTER COLUMN "host_penalty_score" DROP NOT NULL,
ALTER COLUMN "guest_penalty_score" DROP NOT NULL;
