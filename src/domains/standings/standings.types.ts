export interface SnapshotRow {
  team_id: string;
  season: string;
  matches_played: number;
  wins: number;
  draws: number;
  losses: number;
  goals_for: number;
  goals_against: number;
  points: number;
  is_live: boolean;
}

export interface IStandingSnapshot {
  team_id: string;
  season: string;
  matches_played: number;
  wins: number;
  draws: number;
  losses: number;
  goals_for: number;
  goals_against: number;
  points: number;
  computed_at: Date;
  is_live: boolean;
}
