export interface ICreateManager {
  first_name: string | null;
  last_name: string;
  birth_date: Date;
  nationality: string;
  is_retired?: boolean;
  retired_date?: Date;
}

export type ManagerSearchInput = {
  f_name?: string;
  l_name?: string;
};

export interface IManager {
  id: string;
  first_name: string | null;
  last_name: string;
  birth_date: Date;
  nationality: string;
  is_retired: boolean;
  retired_date: Date | null;
  created_at: Date;
  updated_at: Date;
}
