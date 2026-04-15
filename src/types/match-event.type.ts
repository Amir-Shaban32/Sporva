import { Event_types } from "../../generated/prisma";

export interface ICreateMatchEvent {
  match_id: string;
  player_id: string;
  team_id: string;
  event_type: Event_types;
  minute: number;
}

export interface IMatchEvent {
  id: string;
  match_id: string;
  player_id: string;
  team_id: string;
  event_type: Event_types;
  minute: number;
  created_at: Date;
}
