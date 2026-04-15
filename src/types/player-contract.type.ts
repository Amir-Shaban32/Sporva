export interface ICreatePlayerContract {
  player_id: string;
  team_id: string;
  start_date: Date;
  end_date: Date;
  annual_salary: number;
  is_active?: boolean;
}

export interface IPlayerContract {
  id: string;
  player_id: string;
  team_id: string;
  start_date: Date;
  end_date: Date;
  annual_salary: number;
  is_active: boolean;
  created_at: Date;
}
