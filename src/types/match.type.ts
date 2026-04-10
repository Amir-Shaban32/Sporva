import { Competitions, Match_status } from "../../generated/prisma";

export interface Imatch {
  season?: string;
  round: number;
  stadium: string;
  host_team_id: string;
  guest_team_id: string;
  match_time: Date;
  competition: Competitions;
  status: Match_status;
  host_team_score: number;
  guest_team_score: number;
  got_extra_time?: boolean;
  got_penalties?: boolean;
  host_penalty_score?: number;
  guest_penalty_score?: number;
}
