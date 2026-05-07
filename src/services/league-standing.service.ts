import { standingsSnapshotRepository, matchRepository } from "../repositories";
import { IStandingSnapshot } from "../types";
import { handleSeason } from "../utils/handle-season";
import { sortKeyToOrderBy } from "../utils/sort-standings";
import { computeStandings } from "../utils/compute-standings";

export const getLeagueTableService = async (
  season?: string,
): Promise<IStandingSnapshot[] | null> => {
  const handledSeason = handleSeason(season);
  const standings =
    await standingsSnapshotRepository.findBySeason(handledSeason);

  if (!standings || (Array.isArray(standings) && standings.length === 0))
    return null;

  return standings;
};

export const getLeagueTableByMostWinsService = async (
  season?: string,
): Promise<IStandingSnapshot[] | null> => {
  const handledSeason = handleSeason(season);
  const standings = await standingsSnapshotRepository.findBySeasonOnOrderBy(
    handledSeason,
    sortKeyToOrderBy("wins"),
  );

  if (!standings || (Array.isArray(standings) && standings.length === 0))
    return null;

  return standings;
};

export const getLeagueTableByMostDrawsService = async (
  season?: string,
): Promise<IStandingSnapshot[] | null> => {
  const handledSeason = handleSeason(season);
  const standings = await standingsSnapshotRepository.findBySeasonOnOrderBy(
    handledSeason,
    sortKeyToOrderBy("draws"),
  );

  if (!standings || (Array.isArray(standings) && standings.length === 0))
    return null;

  return standings;
};

export const getLeagueTableByLeastLossesService = async (
  season?: string,
): Promise<IStandingSnapshot[] | null> => {
  const handledSeason = handleSeason(season);
  const standings = await standingsSnapshotRepository.findBySeasonOnOrderBy(
    handledSeason,
    sortKeyToOrderBy("losses"),
  );

  if (!standings || (Array.isArray(standings) && standings.length === 0))
    return null;

  return standings;
};

export const getLeagueTableByMostGoalsForService = async (
  season?: string,
): Promise<IStandingSnapshot[] | null> => {
  const handledSeason = handleSeason(season);
  const standings = await standingsSnapshotRepository.findBySeasonOnOrderBy(
    handledSeason,
    sortKeyToOrderBy("goals_for"),
  );

  if (!standings || (Array.isArray(standings) && standings.length === 0))
    return null;

  return standings;
};

export const getLeagueTableByLeastGoalsAgainstService = async (
  season?: string,
): Promise<IStandingSnapshot[] | null> => {
  const handledSeason = handleSeason(season);
  const standings = await standingsSnapshotRepository.findBySeasonOnOrderBy(
    handledSeason,
    sortKeyToOrderBy("goals_against"),
  );

  if (!standings || (Array.isArray(standings) && standings.length === 0))
    return null;

  return standings;
};

export const getLeagueTableByGoalsDifferenceService = async (
  season?: string,
): Promise<IStandingSnapshot[] | null> => {
  const handledSeason = handleSeason(season);
  const standings =
    await standingsSnapshotRepository.findBySeasonOrderByGoalDifference(
      handledSeason,
    );

  if (!standings || (Array.isArray(standings) && standings.length === 0))
    return null;

  return standings;
};

export const recomputeSnapshotService = async (
  season: string,
): Promise<void> => {
  const finishedMatches = await matchRepository.findBySeasonAndStatus(
    season,
    "FINISHED",
  );
  const liveMatches = await matchRepository.findBySeasonAndStatus(
    season,
    "LIVE",
  );
  const records = computeStandings(finishedMatches, liveMatches);
  await standingsSnapshotRepository.upsertMany(records);
};
