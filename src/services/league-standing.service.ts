import { leagueStandingsRepository } from "../repositories";
import { ServiceResult, ILeagueStanding } from "../types";

export const getLeagueTableService = async (
  season?: string,
): Promise<ServiceResult<ILeagueStanding[]>> => {
  try {
    const standings = await leagueStandingsRepository.tableOrder(season);
    if (!standings || (Array.isArray(standings) && standings.length === 0))
      return {
        success: false,
        error: "No standings found",
        code: "NOT_FOUND",
      };
    return { success: true, data: standings };
  } catch (error) {
    return { success: false, code: "DB_ERROR", error: "Database error" };
  }
};

export const getLeagueTableByMostWinsService = async (
  season?: string,
): Promise<ServiceResult<ILeagueStanding[]>> => {
  try {
    const standings =
      await leagueStandingsRepository.tableOrderByMostWins(season);
    if (!standings || (Array.isArray(standings) && standings.length === 0))
      return {
        success: false,
        error: "No standings found",
        code: "NOT_FOUND",
      };
    return { success: true, data: standings };
  } catch (error) {
    return { success: false, code: "DB_ERROR", error: "Database error" };
  }
};

export const getLeagueTableByMostDrawsService = async (
  season?: string,
): Promise<ServiceResult<ILeagueStanding[]>> => {
  try {
    const standings =
      await leagueStandingsRepository.tableOrderByMostDraws(season);
    if (!standings || (Array.isArray(standings) && standings.length === 0))
      return {
        success: false,
        error: "No standings found",
        code: "NOT_FOUND",
      };
    return { success: true, data: standings };
  } catch (error) {
    return { success: false, code: "DB_ERROR", error: "Database error" };
  }
};

export const getLeagueTableByLeastLossesService = async (
  season?: string,
): Promise<ServiceResult<ILeagueStanding[]>> => {
  try {
    const standings =
      await leagueStandingsRepository.tableOrderByLeastLoses(season);
    if (!standings || (Array.isArray(standings) && standings.length === 0))
      return {
        success: false,
        error: "No standings found",
        code: "NOT_FOUND",
      };
    return { success: true, data: standings };
  } catch (error) {
    return { success: false, code: "DB_ERROR", error: "Database error" };
  }
};

export const getLeagueTableByMostGoalsForService = async (
  season?: string,
): Promise<ServiceResult<ILeagueStanding[]>> => {
  try {
    const standings =
      await leagueStandingsRepository.tableOrderByMostGoalsFor(season);
    if (!standings || (Array.isArray(standings) && standings.length === 0))
      return {
        success: false,
        error: "No standings found",
        code: "NOT_FOUND",
      };
    return { success: true, data: standings };
  } catch (error) {
    return { success: false, code: "DB_ERROR", error: "Database error" };
  }
};

export const getLeagueTableByLeastGoalsAgainstService = async (
  season?: string,
): Promise<ServiceResult<ILeagueStanding[]>> => {
  try {
    const standings =
      await leagueStandingsRepository.tableOrderByLeastGoalsAgainst(season);
    if (!standings || (Array.isArray(standings) && standings.length === 0))
      return {
        success: false,
        error: "No standings found",
        code: "NOT_FOUND",
      };
    return { success: true, data: standings };
  } catch (error) {
    return { success: false, code: "DB_ERROR", error: "Database error" };
  }
};

export const getLeagueTableByGoalsDifferenceService = async (
  season?: string,
): Promise<ServiceResult<ILeagueStanding[]>> => {
  try {
    const standings =
      await leagueStandingsRepository.tableOrderByGoalsDifference(season);
    if (!standings || (Array.isArray(standings) && standings.length === 0))
      return {
        success: false,
        error: "No standings found",
        code: "NOT_FOUND",
      };
    return { success: true, data: standings };
  } catch (error) {
    return { success: false, code: "DB_ERROR", error: "Database error" };
  }
};
