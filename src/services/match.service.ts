import { matchRepository } from "../repositories";
import { IMatch, ICreateMatch } from "../types";
import { Prisma, Match_status, Competitions } from "../../generated/prisma";
import {
  ConflictError,
  NotFoundError,
  UnprocessableEntityError,
} from "../errors/app-error";
import { checkValidUpdateMatch } from "../utils/check-update-match";

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
  const normalizedStatus = status.toUpperCase() as Match_status;
  const matches = await matchRepository.findByStatus(normalizedStatus);
  if (!matches.length) {
    throw new NotFoundError("No matches found");
  }
  return matches;
};

export const getMatchesByCompetitionService = async (
  competition: Competitions,
): Promise<IMatch[]> => {
  const normalizedComp = competition.toUpperCase() as Competitions;
  const matches = await matchRepository.findByComp(normalizedComp);
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
  const existing = await matchRepository.findById(id);
  if (!existing) {
    throw new NotFoundError("Match not found");
  }
  checkValidUpdateMatch(data, existing);
  const match = await matchRepository.update(id, data);
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
