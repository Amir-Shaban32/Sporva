import { matchRefereeRepository } from "../repositories";
import { ICreateMatchReferee, IMatchReferee } from "../types";
import { NotFoundError } from "../errors/app-error";

export const assignRefereeToMatchService = async (
  data: ICreateMatchReferee,
): Promise<IMatchReferee> => {
  const assignment = await matchRefereeRepository.assign(data);
  return assignment;
};

export const getRefereesByMatchService = async (
  match_id: string,
): Promise<IMatchReferee[]> => {
  const referees = await matchRefereeRepository.findByMatch(match_id);
  if (!referees.length) {
    throw new NotFoundError("No referees found");
  }
  return referees;
};

export const getMatchesByRefereeService = async (
  referee_id: string,
): Promise<IMatchReferee[]> => {
  const matches = await matchRefereeRepository.findByReferee(referee_id);
  if (!matches.length) {
    throw new NotFoundError("No matches found");
  }
  return matches;
};

export const unAssignRefereeFromMatchService = async (
  data: ICreateMatchReferee,
): Promise<IMatchReferee> => {
  const result = await matchRefereeRepository.unAssign(data);
  return result;
};
