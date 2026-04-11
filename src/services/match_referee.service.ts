import { matchRefereeRepository } from "../repositories/match_referee.repository";
import { ServiceResult, ICreateMatchReferee, IMatchReferee } from "../types";

export const assignRefereeToMatchService = async (
  data: ICreateMatchReferee,
): Promise<ServiceResult<IMatchReferee>> => {
  try {
    const assignment = await matchRefereeRepository.assign(data);
    return { success: true, data: assignment };
  } catch (error) {
    return { success: false, code: "DB_ERROR", error: "Database error" };
  }
};

export const getRefereesByMatchService = async (
  match_id: string,
): Promise<ServiceResult<IMatchReferee[]>> => {
  try {
    const referees = await matchRefereeRepository.findByMatch(match_id);
    if (!referees.length)
      return {
        success: false,
        error: "No referees found",
        code: "NOT_FOUND",
      };
    return { success: true, data: referees };
  } catch (error) {
    return { success: false, code: "DB_ERROR", error: "Database error" };
  }
};

export const getMatchesByRefereeService = async (
  referee_id: string,
): Promise<ServiceResult<IMatchReferee[]>> => {
  try {
    const matches = await matchRefereeRepository.findByReferee(referee_id);
    if (!matches.length)
      return {
        success: false,
        error: "No matches found",
        code: "NOT_FOUND",
      };
    return { success: true, data: matches };
  } catch (error) {
    return { success: false, code: "DB_ERROR", error: "Database error" };
  }
};

export const unAssignRefereeFromMatchService = async (
  data: ICreateMatchReferee,
): Promise<ServiceResult<IMatchReferee>> => {
  try {
    const result = await matchRefereeRepository.unAssign(data);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, code: "DB_ERROR", error: "Database error" };
  }
};
