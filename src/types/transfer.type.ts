import { Transfer_type } from "../../generated/prisma";

export interface Itransfer {
  player_id: string;
  from_team_id: string;
  to_team_id: string;
  transfer_date?: Date;
  transfer_fee: number;
  transfer_type: Transfer_type;
}
