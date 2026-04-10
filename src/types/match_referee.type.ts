import { Referee_role } from "../../generated/prisma";

export interface Imatch_referee {
  match_id: string;
  referee_id: string;
  role: Referee_role;
}
