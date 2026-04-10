import { Positions, Foot_preference } from "../../generated/prisma";

export interface Iplayer {
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
