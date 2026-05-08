import { Positions, Foot_preference } from "@generated/prisma";

export interface ICreatePlayer {
  first_name?: string;
  last_name: string;
  birth_date: Date;
  nationality: string;
  jersey_number: number;
  position: Positions;
  preferred_foot?: Foot_preference;
  joined_date: Date;
  team_id: string;
  is_retired?: boolean;
  retired_date?: Date | null;
}

export type PlayerSearchInput = {
  f_name?: string;
  l_name?: string;
};

export interface IPlayer {
  id: string;
  first_name: string | null;
  last_name: string;
  birth_date: Date;
  nationality: string;
  jersey_number: number;
  position: Positions;
  preferred_foot: Foot_preference;
  joined_date: Date;
  team_id: string;
  is_retired: boolean;
  retired_date: Date | null;
  created_at: Date;
  updated_at: Date;
}
