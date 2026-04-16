import { leagueStandingsRepository } from "../repositories";
import { ILeagueStanding } from "../types";
import { NotFoundError } from "../errors/app-error";

export const getLeagueTableService = async (
  season?: string,
): Promise<ILeagueStanding[]> => {
  const standings = await leagueStandingsRepository.tableOrder(season);
  if (!standings || (Array.isArray(standings) && standings.length === 0)) {
    throw new NotFoundError("No standings found");
  }
  return standings;
};

export const getLeagueTableByMostWinsService = async (
  season?: string,
): Promise<ILeagueStanding[]> => {
  const standings =
    await leagueStandingsRepository.tableOrderByMostWins(season);
  if (!standings || (Array.isArray(standings) && standings.length === 0)) {
    throw new NotFoundError("No standings found");
  }
  return standings;
};

export const getLeagueTableByMostDrawsService = async (
  season?: string,
): Promise<ILeagueStanding[]> => {
  const standings =
    await leagueStandingsRepository.tableOrderByMostDraws(season);
  if (!standings || (Array.isArray(standings) && standings.length === 0)) {
    throw new NotFoundError("No standings found");
  }
  return standings;
};

export const getLeagueTableByLeastLossesService = async (
  season?: string,
): Promise<ILeagueStanding[]> => {
  const standings =
    await leagueStandingsRepository.tableOrderByLeastLoses(season);
  if (!standings || (Array.isArray(standings) && standings.length === 0)) {
    throw new NotFoundError("No standings found");
  }
  return standings;
};

export const getLeagueTableByMostGoalsForService = async (
  season?: string,
): Promise<ILeagueStanding[]> => {
  const standings =
    await leagueStandingsRepository.tableOrderByMostGoalsFor(season);
  if (!standings || (Array.isArray(standings) && standings.length === 0)) {
    throw new NotFoundError("No standings found");
  }
  return standings;
};

export const getLeagueTableByLeastGoalsAgainstService = async (
  season?: string,
): Promise<ILeagueStanding[]> => {
  const standings =
    await leagueStandingsRepository.tableOrderByLeastGoalsAgainst(season);
  if (!standings || (Array.isArray(standings) && standings.length === 0)) {
    throw new NotFoundError("No standings found");
  }
  return standings;
};

export const getLeagueTableByGoalsDifferenceService = async (
  season?: string,
): Promise<ILeagueStanding[]> => {
  const standings =
    await leagueStandingsRepository.tableOrderByGoalsDifference(season);
  if (!standings || (Array.isArray(standings) && standings.length === 0)) {
    throw new NotFoundError("No standings found");
  }
  return standings;
};
