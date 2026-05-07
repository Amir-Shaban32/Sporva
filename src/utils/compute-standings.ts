import { IMatch, SnapshotRow } from "../types";

function initializeRow(team_id: string, season: string): SnapshotRow {
  return {
    team_id,
    season,
    matches_played: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    goals_for: 0,
    goals_against: 0,
    points: 0,
    is_live: false,
  };
}

function ensureRecord(
  acc: Map<string, SnapshotRow>,
  team_id: string,
  season: string,
) {
  if (!acc.has(team_id)) acc.set(team_id, initializeRow(team_id, season));
  return acc.get(team_id)!;
}

function accumulateMatch(
  acc: Map<string, SnapshotRow>,
  match: IMatch,
  is_live: boolean,
) {
  const hostRecord = ensureRecord(acc, match.host_team_id, match.season);
  const guestRecord = ensureRecord(acc, match.guest_team_id, match.season);

  const hostScore = match.host_team_score ?? 0;
  const guestScore = match.guest_team_score ?? 0;

  hostRecord.matches_played += 1;
  hostRecord.goals_for += hostScore;
  hostRecord.goals_against += guestScore;

  guestRecord.matches_played += 1;
  guestRecord.goals_for += guestScore;
  guestRecord.goals_against += hostScore;

  if (is_live) {
    hostRecord.is_live = true;
    guestRecord.is_live = true;
  }

  if (hostScore > guestScore) {
    hostRecord.wins += 1;
    hostRecord.points += 3;
    guestRecord.losses += 1;
  } else if (hostScore < guestScore) {
    hostRecord.losses += 1;
    guestRecord.wins += 1;
    guestRecord.points += 3;
  } else {
    hostRecord.draws += 1;
    hostRecord.points += 1;
    guestRecord.draws += 1;
    guestRecord.points += 1;
  }
}

export function computeStandings(
  finishedMatches: IMatch[],
  liveMatches: IMatch[],
): SnapshotRow[] {
  const acc = new Map<string, SnapshotRow>();

  for (const match of finishedMatches) accumulateMatch(acc, match, false);
  for (const match of liveMatches) accumulateMatch(acc, match, true);

  return Array.from(acc.values());
}
