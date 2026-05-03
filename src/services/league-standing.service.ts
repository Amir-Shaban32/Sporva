import { leagueStandingsRepository } from "../repositories";
import { ILeagueStanding } from "../types";
import { handleSeason } from "../utils/handle-season";

export const getLeagueTableService = async (
  season?: string,
): Promise<ILeagueStanding[] | null> => {
  const handledSeason = handleSeason(season);
  const standings = await leagueStandingsRepository.tableOrder(handledSeason);

  if (!standings || (Array.isArray(standings) && standings.length === 0))
    return null;

  return standings;
};

export const getLeagueTableByMostWinsService = async (
  season?: string,
): Promise<ILeagueStanding[] | null> => {
  const handledSeason = handleSeason(season);
  const standings =
    await leagueStandingsRepository.tableOrderByMostWins(handledSeason);

  if (!standings || (Array.isArray(standings) && standings.length === 0))
    return null;

  return standings;
};

export const getLeagueTableByMostDrawsService = async (
  season?: string,
): Promise<ILeagueStanding[] | null> => {
  const handledSeason = handleSeason(season);
  const standings =
    await leagueStandingsRepository.tableOrderByMostDraws(handledSeason);

  if (!standings || (Array.isArray(standings) && standings.length === 0))
    return null;

  return standings;
};

export const getLeagueTableByLeastLossesService = async (
  season?: string,
): Promise<ILeagueStanding[] | null> => {
  const handledSeason = handleSeason(season);
  const standings =
    await leagueStandingsRepository.tableOrderByLeastLoses(handledSeason);

  if (!standings || (Array.isArray(standings) && standings.length === 0))
    return null;

  return standings;
};

export const getLeagueTableByMostGoalsForService = async (
  season?: string,
): Promise<ILeagueStanding[] | null> => {
  const handledSeason = handleSeason(season);
  const standings =
    await leagueStandingsRepository.tableOrderByMostGoalsFor(handledSeason);

  if (!standings || (Array.isArray(standings) && standings.length === 0))
    return null;

  return standings;
};

export const getLeagueTableByLeastGoalsAgainstService = async (
  season?: string,
): Promise<ILeagueStanding[] | null> => {
  const handledSeason = handleSeason(season);
  const standings =
    await leagueStandingsRepository.tableOrderByLeastGoalsAgainst(
      handledSeason,
    );

  if (!standings || (Array.isArray(standings) && standings.length === 0))
    return null;

  return standings;
};

export const getLeagueTableByGoalsDifferenceService = async (
  season?: string,
): Promise<ILeagueStanding[] | null> => {
  const handledSeason = handleSeason(season);
  const standings =
    await leagueStandingsRepository.tableOrderByGoalsDifference(handledSeason);

  if (!standings || (Array.isArray(standings) && standings.length === 0))
    return null;

  return standings;
};
