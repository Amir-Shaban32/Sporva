import { Referee_role } from "@generated/prisma";

export interface ICreateMatchReferee {
  match_id: string;
  referee_id: string;
  role: Referee_role;
}

export interface IMatchReferee {
  match_id: string;
  referee_id: string;
  role: Referee_role;
}
