export interface Iplayer_contract {
  player_id: string;
  team_id: string;
  start_date: Date;
  end_date: Date;
  annual_salary: number;
  is_active?: boolean;
}
