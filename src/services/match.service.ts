import { matchRepository } from "../repositories";
import { IMatch, ICreateMatch } from "../types";
import { Prisma, Match_status, Competitions } from "../../generated/prisma";
import {
  ConflictError,
  NotFoundError,
  UnprocessableEntityError,
} from "../errors/app-error";
import { checkValidUpdateMatch } from "../utils/check-update-match";
import { checkValidRecordResult } from "../utils/check-valid-result";
import { logger } from "../config";
import { recomputeSnapshotService } from "./league-standing.service";

export const scheduleMatchService = async (
  data: ICreateMatch,
): Promise<IMatch> => {
  const currentYear = new Date().getFullYear();
  const season = data.season ?? `${currentYear}-${currentYear + 1}`;
  const seasonYear = Number(season.split("-")[0]);

  const matchYear = new Date(data.match_time).getFullYear();
  const isValidTime = matchYear <= seasonYear + 1 && matchYear >= seasonYear;

  if (!isValidTime)
    throw new UnprocessableEntityError(
      "Can't create Match outside season time zone",
    );

  const existing = await matchRepository.findByTeamsAndSeasonAndComp(
    season,
    data.guest_team_id,
    data.host_team_id,
    data.competition,
  );
  if (existing)
    throw new ConflictError("Match already scheduled for this season");
  const match = await matchRepository.schedule({ ...data, season });
  return match;
};

export const getMatchByIdService = async (id: string): Promise<IMatch> => {
  const match = await matchRepository.findById(id);
  if (!match) throw new NotFoundError("match not found");
  return match;
};

export const getMatchByTeamService = async (
  team_id: string,
): Promise<IMatch[] | null> => {
  const matches = await matchRepository.findByTeam(team_id);
  if (!matches.length) return null;
  return matches;
};

export const getLiveMatchesService = async (): Promise<IMatch[] | null> => {
  const matches = await matchRepository.findLive();
  if (!matches.length) return null;
  return matches;
};

export const getMatchesByStatusService = async (
  status: Match_status,
): Promise<IMatch[] | null> => {
  const normalizedStatus = status.toUpperCase() as Match_status;
  const matches = await matchRepository.findByStatus(normalizedStatus);
  if (!matches.length) return null;
  return matches;
};

export const getMatchesByCompetitionService = async (
  competition: Competitions,
): Promise<IMatch[] | null> => {
  const normalizedComp = competition.toUpperCase() as Competitions;
  const matches = await matchRepository.findByComp(normalizedComp);
  if (!matches.length) return null;
  return matches;
};

export const getMatchesBySeason = async (
  season: string,
): Promise<IMatch[] | null> => {
  const matches = await matchRepository.findBySeason(season);
  if (!matches.length) return null;
  return matches;
};

export const updateMatchService = async (
  id: string,
  data: Prisma.MatchesUpdateInput,
): Promise<IMatch> => {
  const existing = await matchRepository.findById(id);
  if (!existing) {
    throw new NotFoundError("Match not found");
  }
  checkValidUpdateMatch(data, existing);
  const match = await matchRepository.update(id, data);

  const isScoreUpdate =
    data.host_team_score !== undefined || data.guest_team_score !== undefined;
  const isLive = match.status === "LIVE";
  if (isScoreUpdate && isLive) await recomputeSnapshotService(match.season);
  return match;
};

export const updateMatchStatusService = async (
  id: string,
  status: Match_status,
) => {
  const existing = await matchRepository.findById(id);
  if (!existing) throw new NotFoundError("Match not found");
  const match = await matchRepository.updateMatchStatus(id, status);
  if (status === "LIVE") await recomputeSnapshotService(match.season);
};

export const recordMatchResultService = async (id: string): Promise<void> => {
  const match = await matchRepository.findById(id);
  if (!match) throw new NotFoundError("Match not found");
  checkValidRecordResult(match);
  if (match.guest_team_score === null || match.host_team_score === null) {
    throw new UnprocessableEntityError("Match scores are not recorded");
  }

  await matchRepository.updateStatus(id);
  await recomputeSnapshotService(match.season);

  logger.info(
    {
      match_id: id,
      host_team_id: match.host_team_id,
      guest_team_id: match.guest_team_id,
      host_score: match.host_team_score,
      guest_score: match.guest_team_score,
      season: match.season,
      round: match.round,
    },
    "Match result finalized",
  );
};

export const getMatchesByDateService = async (
  date: Date,
): Promise<IMatch[] | null> => {
  const matches = await matchRepository.findByDate(date);
  if (!matches.length) return null;
  return matches;
};

export const getMatchesByRoundService = async (
  round: number,
): Promise<IMatch[] | null> => {
  const matches = await matchRepository.findByRound(round);
  if (!matches.length) return null;
  return matches;
};

export const getMatchesWithExtraTimeService = async (): Promise<
  IMatch[] | null
> => {
  const matches = await matchRepository.findGotExtra();
  if (!matches.length) return null;
  return matches;
};

export const getMatchesWithPenaltiesService = async (): Promise<
  IMatch[] | null
> => {
  const matches = await matchRepository.findGotPenalties();
  if (!matches.length) return null;
  return matches;
};
