export interface ICreateTeam {
  name: string;
  founded_year: number;
  city: string;
  stadium: string;
  current_manager_id: string;
}

export interface ITeam {
  id: string;
  name: string;
  founded_year: number;
  city: string;
  stadium: string;
  created_at: Date;
  updated_at: Date;
  current_manager_id: string;
}

export type TeamSearchInput = {
  name?: string;
};
