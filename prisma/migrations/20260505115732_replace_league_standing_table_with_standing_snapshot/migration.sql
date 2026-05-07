/*
  Warnings:

  - You are about to drop the `League_Standings` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "League_Standings" DROP CONSTRAINT "League_Standings_team_id_fkey";

-- DropTable
DROP TABLE "League_Standings";
