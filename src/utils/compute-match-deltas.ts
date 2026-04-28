import { MatchResult } from "../types";

export const computeMatchDeltas = (
  guest_team_score: number,
  host_team_score: number,
): MatchResult[] => {
  const guest_won = guest_team_score > host_team_score;
  const guest_drew = guest_team_score === host_team_score;

  const guest_result = {
    won: guest_won,
    drew: guest_drew,
    goals_for: guest_team_score,
    goals_against: host_team_score,
  };

  const host_result = {
    won: !guest_won,
    drew: guest_drew,
    goals_for: host_team_score,
    goals_against: guest_team_score,
  };

  return [guest_result, host_result];
};
