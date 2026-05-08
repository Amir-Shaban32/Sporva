import { Transfer_type } from "@generated/prisma";

export interface ICreateTransfer {
  player_id: string;
  from_team_id: string;
  to_team_id: string;
  transfer_date?: Date;
  transfer_fee: number;
  transfer_type: Transfer_type;
}

export interface ITransfer {
  id: string;
  player_id: string;
  from_team_id: string;
  to_team_id: string;
  transfer_date: Date;
  transfer_fee: number;
  transfer_type: Transfer_type;
  created_at: Date;
}
