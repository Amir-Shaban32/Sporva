import { matchRepository } from "../repositories";
import { IMatch, ICreateMatch } from "../types";
import { Prisma, Match_status, Competitions } from "../../generated/prisma";
import { NotFoundError } from "../errors/app-error";

export const scheduleMatchService = async (
  data: ICreateMatch,
): Promise<IMatch> => {
  const match = await matchRepository.schedule(data);
  return match;
};

export const getMatchByTeamService = async (
  team_id: string,
): Promise<IMatch[]> => {
  const matches = await matchRepository.findByTeam(team_id);
  if (!matches.length) {
    throw new NotFoundError("No matches found");
  }
  return matches;
};

export const getLiveMatchesService = async (): Promise<IMatch[]> => {
  const matches = await matchRepository.findLive();
  if (!matches.length) {
    throw new NotFoundError("No live matches found");
  }
  return matches;
};

export const getMatchesByStatusService = async (
  status: Match_status,
): Promise<IMatch[]> => {
  const matches = await matchRepository.findByStatus(status);
  if (!matches.length) {
    throw new NotFoundError("No matches found");
  }
  return matches;
};

export const getMatchesByCompetitionService = async (
  competition: Competitions,
): Promise<IMatch[]> => {
  const matches = await matchRepository.findByComp(competition);
  if (!matches.length) {
    throw new NotFoundError("No matches found");
  }
  return matches;
};

export const getMatchesBySeason = async (season: string): Promise<IMatch[]> => {
  const matches = await matchRepository.findBySeason(season);
  if (!matches.length) {
    throw new NotFoundError("No matches found");
  }
  return matches;
};

export const updateMatchService = async (
  id: string,
  data: Prisma.MatchesUpdateInput,
): Promise<IMatch> => {
  const match = await matchRepository.update(id, data);
  if (!match) {
    throw new NotFoundError("Match not found");
  }

  return match;
};

export const getMatchesByDateService = async (
  date: Date,
): Promise<IMatch[]> => {
  const matches = await matchRepository.findByDate(date);
  if (!matches.length) {
    throw new NotFoundError("No matches found");
  }
  return matches;
};

export const getMatchesByRoundService = async (
  round: number,
): Promise<IMatch[]> => {
  const matches = await matchRepository.findByRound(round);
  if (!matches.length) {
    throw new NotFoundError("No matches found");
  }
  return matches;
};

export const getMatchesWithExtraTimeService = async (): Promise<IMatch[]> => {
  const matches = await matchRepository.findGotExtra();
  if (!matches.length) {
    throw new NotFoundError("No matches found");
  }
  return matches;
};

export const getMatchesWithPenaltiesService = async (): Promise<IMatch[]> => {
  const matches = await matchRepository.findGotPenalties();
  if (!matches.length) {
    throw new NotFoundError("No matches found");
  }
  return matches;
};
