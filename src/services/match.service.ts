import { matchRepository } from "../repositories/match.repository";
import { ServiceResult, IMatch, ICreateMatch } from "../types";
import { Prisma, Match_status, Competitions } from "../../generated/prisma";

export const scheduleMatchService = async (
  data: ICreateMatch,
): Promise<ServiceResult<IMatch>> => {
  try {
    const match = await matchRepository.schedule(data);
    return { success: true, data: match };
  } catch (error) {
    return { success: false, code: "DB_ERROR", error: "Database error" };
  }
};

export const getMatchByTeamService = async (
  team_id: string,
): Promise<ServiceResult<IMatch[]>> => {
  try {
    const matches = await matchRepository.findByTeam(team_id);
    if (!matches.length)
      return { success: false, error: "No matches found", code: "NOT_FOUND" };
    return { success: true, data: matches };
  } catch (error) {
    return { success: false, code: "DB_ERROR", error: "Database error" };
  }
};

export const getLiveMatchesService = async (): Promise<
  ServiceResult<IMatch[]>
> => {
  try {
    const matches = await matchRepository.findLive();
    if (!matches.length)
      return {
        success: false,
        error: "No live matches found",
        code: "NOT_FOUND",
      };
    return { success: true, data: matches };
  } catch (error) {
    return { success: false, code: "DB_ERROR", error: "Database error" };
  }
};

export const getMatchesByStatusService = async (
  status: Match_status,
): Promise<ServiceResult<IMatch[]>> => {
  try {
    const matches = await matchRepository.findByStatus(status);
    if (!matches.length)
      return { success: false, error: "No matches found", code: "NOT_FOUND" };
    return { success: true, data: matches };
  } catch (error) {
    return { success: false, code: "DB_ERROR", error: "Database error" };
  }
};

export const getMatchesByCompetitionService = async (
  competition: Competitions,
): Promise<ServiceResult<IMatch[]>> => {
  try {
    const matches = await matchRepository.findByComp(competition);
    if (!matches.length)
      return { success: false, error: "No matches found", code: "NOT_FOUND" };
    return { success: true, data: matches };
  } catch (error) {
    return { success: false, code: "DB_ERROR", error: "Database error" };
  }
};

export const getMatchesBySeason = async (
  season: string,
): Promise<ServiceResult<IMatch[]>> => {
  try {
    const matches = await matchRepository.findBySeason(season);
    if (!matches.length)
      return { success: false, error: "No matches found", code: "NOT_FOUND" };
    return { success: true, data: matches };
  } catch (error) {
    return { success: false, code: "DB_ERROR", error: "Database error" };
  }
};

export const updateMatchService = async (
  id: string,
  data: Prisma.MatchesUpdateInput,
): Promise<ServiceResult<IMatch>> => {
  try {
    const match = await matchRepository.update(id, data);
    if (!match)
      return { success: false, error: "Match not found", code: "NOT_FOUND" };

    return { success: true, data: match };
  } catch (error) {
    return { success: false, code: "DB_ERROR", error: "Database error" };
  }
};

export const getMatchesByDateService = async (
  date: Date,
): Promise<ServiceResult<IMatch[]>> => {
  try {
    const matches = await matchRepository.findByDate(date);
    if (!matches.length)
      return { success: false, error: "No matches found", code: "NOT_FOUND" };
    return { success: true, data: matches };
  } catch (error) {
    return { success: false, code: "DB_ERROR", error: "Database error" };
  }
};

export const getMatchesByRoundService = async (
  round: number,
): Promise<ServiceResult<IMatch[]>> => {
  try {
    const matches = await matchRepository.findByRound(round);
    if (!matches.length)
      return { success: false, error: "No matches found", code: "NOT_FOUND" };
    return { success: true, data: matches };
  } catch (error) {
    return { success: false, code: "DB_ERROR", error: "Database error" };
  }
};

export const getMatchesWithExtraTimeService = async (): Promise<
  ServiceResult<IMatch[]>
> => {
  try {
    const matches = await matchRepository.findGotExtra();
    if (!matches.length)
      return { success: false, error: "No matches found", code: "NOT_FOUND" };
    return { success: true, data: matches };
  } catch (error) {
    return { success: false, code: "DB_ERROR", error: "Database error" };
  }
};

export const getMatchesWithPenaltiesService = async (): Promise<
  ServiceResult<IMatch[]>
> => {
  try {
    const matches = await matchRepository.findGotPenalties();
    if (!matches.length)
      return { success: false, error: "No matches found", code: "NOT_FOUND" };
    return { success: true, data: matches };
  } catch (error) {
    return { success: false, code: "DB_ERROR", error: "Database error" };
  }
};
