import { Event_types } from "../../generated/prisma";

export interface Ievent {
  match_id: string;
  player_id: string;
  team_id: string;
  event_type: Event_types;
  minute: number;
}
