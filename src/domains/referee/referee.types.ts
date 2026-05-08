export interface ICreateReferee {
  first_name: string | null;
  last_name: string;
  birth_date: Date;
  nationality: string;
  is_retired?: boolean;
  retired_date?: Date | null;
}

export type RefereeSearchInput = {
  f_name?: string;
  l_name?: string;
};

export interface IReferee {
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
