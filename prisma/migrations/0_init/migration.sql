-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "User_Role" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "Positions" AS ENUM ('GK', 'RB', 'CB', 'LB', 'CDM', 'CM', 'AM', 'RW', 'LW', 'CF', 'ST');

-- CreateEnum
CREATE TYPE "Competitions" AS ENUM ('LEAGUE', 'CUP', 'SUPER', 'CAF');

-- CreateEnum
CREATE TYPE "Referee_role" AS ENUM ('MAIN', 'ASSISTANT_1', 'ASSISTANT_2', 'ASSISTANT_3', 'VAR');

-- CreateEnum
CREATE TYPE "Transfer_type" AS ENUM ('permanent', 'free', 'loan');

-- CreateEnum
CREATE TYPE "Match_status" AS ENUM ('SCHEDULED', 'LIVE', 'FINISHED', 'POSTPONED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "Event_types" AS ENUM ('GOAL', 'ASSIST', 'OWN_GOAL', 'SUB_IN', 'SUB_OUT', 'YELLOW_CARD', 'RED_CARD', 'SCORE_PENALTY', 'CAUSE_PENALTY');

-- CreateEnum
CREATE TYPE "Foot_preference" AS ENUM ('LEFT', 'RIGHT', 'BOTH');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "role" "User_Role" NOT NULL DEFAULT 'USER',
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Refresh_Tokens" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_used" TIMESTAMP(3) NOT NULL,
    "device_info" JSONB NOT NULL,
    "is_revoked" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Refresh_Tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Managers" (
    "id" TEXT NOT NULL,
    "first_name" TEXT,
    "last_name" TEXT NOT NULL,
    "birth_date" TIMESTAMP(3) NOT NULL,
    "nationality" TEXT NOT NULL,
    "is_retired" BOOLEAN NOT NULL DEFAULT false,
    "retired_date" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Managers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Teams" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "founded_year" INTEGER NOT NULL,
    "city" TEXT NOT NULL,
    "stadium" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "current_manager_id" TEXT NOT NULL,

    CONSTRAINT "Teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Players" (
    "id" TEXT NOT NULL,
    "first_name" TEXT,
    "last_name" TEXT NOT NULL,
    "birth_date" TIMESTAMP(3) NOT NULL,
    "nationality" TEXT NOT NULL,
    "jersey_number" INTEGER NOT NULL,
    "preferred_foot" "Foot_preference" NOT NULL DEFAULT 'RIGHT',
    "joined_date" TIMESTAMP(3) NOT NULL,
    "team_id" TEXT NOT NULL,
    "is_retired" BOOLEAN NOT NULL DEFAULT false,
    "retired_date" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Players_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Referees" (
    "id" TEXT NOT NULL,
    "first_name" TEXT,
    "last_name" TEXT NOT NULL,
    "birth_date" TIMESTAMP(3) NOT NULL,
    "nationality" TEXT NOT NULL,
    "is_retired" BOOLEAN NOT NULL DEFAULT false,
    "retired_date" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Referees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transfers" (
    "id" TEXT NOT NULL,
    "player_id" TEXT NOT NULL,
    "from_team_id" TEXT NOT NULL,
    "to_team_id" TEXT NOT NULL,
    "transfer_date" TIMESTAMP(3) NOT NULL,
    "transfer_fee" DECIMAL(65,30) NOT NULL,
    "transfer_type" "Transfer_type" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transfers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Matches" (
    "id" TEXT NOT NULL,
    "season" TEXT NOT NULL,
    "round" INTEGER NOT NULL,
    "stadium" TEXT NOT NULL,
    "host_team_id" TEXT NOT NULL,
    "guest_team_id" TEXT NOT NULL,
    "match_time" TIMESTAMP(3) NOT NULL,
    "competition" "Competitions" NOT NULL,
    "status" "Match_status" NOT NULL,
    "host_team_score" INTEGER NOT NULL,
    "guest_team_score" INTEGER NOT NULL,
    "got_extra_time" BOOLEAN NOT NULL DEFAULT false,
    "got_penalties" BOOLEAN NOT NULL DEFAULT false,
    "host_penalty_score" INTEGER NOT NULL,
    "guest_penalty_score" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Matches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Match_Referees" (
    "match_id" TEXT NOT NULL,
    "referee_id" TEXT NOT NULL,
    "role" "Referee_role" NOT NULL,

    CONSTRAINT "Match_Referees_pkey" PRIMARY KEY ("match_id","referee_id","role")
);

-- CreateTable
CREATE TABLE "Match_Events" (
    "id" TEXT NOT NULL,
    "match_id" TEXT NOT NULL,
    "player_id" TEXT NOT NULL,
    "team_id" TEXT NOT NULL,
    "event_type" "Event_types" NOT NULL,
    "minute" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Match_Events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Player_Contracts" (
    "id" TEXT NOT NULL,
    "player_id" TEXT NOT NULL,
    "team_id" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "annual_salary" DECIMAL(65,30) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Player_Contracts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Manager_Contracts" (
    "id" TEXT NOT NULL,
    "manager_id" TEXT NOT NULL,
    "team_id" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "annual_salary" DECIMAL(65,30) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Manager_Contracts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "League_Standings" (
    "team_id" TEXT NOT NULL,
    "season" TEXT NOT NULL,
    "matches_played" INTEGER NOT NULL DEFAULT 0,
    "wins" INTEGER NOT NULL DEFAULT 0,
    "draws" INTEGER NOT NULL DEFAULT 0,
    "losses" INTEGER NOT NULL DEFAULT 0,
    "goals_for" INTEGER NOT NULL DEFAULT 0,
    "goals_against" INTEGER NOT NULL DEFAULT 0,
    "points" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "League_Standings_pkey" PRIMARY KEY ("season","team_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Refresh_Tokens_token_key" ON "Refresh_Tokens"("token");

-- CreateIndex
CREATE INDEX "Refresh_Tokens_user_id_idx" ON "Refresh_Tokens"("user_id");

-- CreateIndex
CREATE INDEX "Refresh_Tokens_expires_at_idx" ON "Refresh_Tokens"("expires_at");

-- CreateIndex
CREATE INDEX "Refresh_Tokens_user_id_expires_at_idx" ON "Refresh_Tokens"("user_id", "expires_at");

-- CreateIndex
CREATE UNIQUE INDEX "Teams_current_manager_id_key" ON "Teams"("current_manager_id");

-- CreateIndex
CREATE INDEX "Transfers_player_id_idx" ON "Transfers"("player_id");

-- CreateIndex
CREATE INDEX "Transfers_transfer_date_idx" ON "Transfers"("transfer_date");

-- CreateIndex
CREATE INDEX "Matches_match_time_idx" ON "Matches"("match_time");

-- CreateIndex
CREATE INDEX "Matches_competition_idx" ON "Matches"("competition");

-- CreateIndex
CREATE INDEX "Matches_season_idx" ON "Matches"("season");

-- CreateIndex
CREATE INDEX "Match_Events_match_id_idx" ON "Match_Events"("match_id");

-- CreateIndex
CREATE INDEX "Match_Events_player_id_idx" ON "Match_Events"("player_id");

-- CreateIndex
CREATE INDEX "Match_Events_event_type_idx" ON "Match_Events"("event_type");

-- CreateIndex
CREATE INDEX "Player_Contracts_player_id_idx" ON "Player_Contracts"("player_id");

-- CreateIndex
CREATE INDEX "Player_Contracts_player_id_is_active_idx" ON "Player_Contracts"("player_id", "is_active");

-- CreateIndex
CREATE INDEX "Manager_Contracts_manager_id_idx" ON "Manager_Contracts"("manager_id");

-- CreateIndex
CREATE INDEX "Manager_Contracts_manager_id_is_active_idx" ON "Manager_Contracts"("manager_id", "is_active");

-- AddForeignKey
ALTER TABLE "Refresh_Tokens" ADD CONSTRAINT "Refresh_Tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Teams" ADD CONSTRAINT "Teams_current_manager_id_fkey" FOREIGN KEY ("current_manager_id") REFERENCES "Managers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Players" ADD CONSTRAINT "Players_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "Teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transfers" ADD CONSTRAINT "Transfers_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "Players"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transfers" ADD CONSTRAINT "Transfers_from_team_id_fkey" FOREIGN KEY ("from_team_id") REFERENCES "Teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transfers" ADD CONSTRAINT "Transfers_to_team_id_fkey" FOREIGN KEY ("to_team_id") REFERENCES "Teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Matches" ADD CONSTRAINT "Matches_host_team_id_fkey" FOREIGN KEY ("host_team_id") REFERENCES "Teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Matches" ADD CONSTRAINT "Matches_guest_team_id_fkey" FOREIGN KEY ("guest_team_id") REFERENCES "Teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match_Referees" ADD CONSTRAINT "Match_Referees_match_id_fkey" FOREIGN KEY ("match_id") REFERENCES "Matches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match_Referees" ADD CONSTRAINT "Match_Referees_referee_id_fkey" FOREIGN KEY ("referee_id") REFERENCES "Referees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match_Events" ADD CONSTRAINT "Match_Events_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "Teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match_Events" ADD CONSTRAINT "Match_Events_match_id_fkey" FOREIGN KEY ("match_id") REFERENCES "Matches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match_Events" ADD CONSTRAINT "Match_Events_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "Players"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Player_Contracts" ADD CONSTRAINT "Player_Contracts_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "Players"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Player_Contracts" ADD CONSTRAINT "Player_Contracts_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "Teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Manager_Contracts" ADD CONSTRAINT "Manager_Contracts_manager_id_fkey" FOREIGN KEY ("manager_id") REFERENCES "Managers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Manager_Contracts" ADD CONSTRAINT "Manager_Contracts_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "Teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "League_Standings" ADD CONSTRAINT "League_Standings_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "Teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

