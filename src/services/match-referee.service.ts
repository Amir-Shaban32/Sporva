import {
  matchRefereeRepository,
  matchRepository,
  refereeRepository,
} from "../repositories";
import { ICreateMatchReferee, IMatchReferee } from "../types";
import {
  NotFoundError,
  ConflictError,
  UnprocessableEntityError,
} from "../errors/app-error";
import { Match_status } from "generated/prisma";

export const assignRefereeToMatchService = async (
  data: ICreateMatchReferee,
): Promise<IMatchReferee> => {
  const [existing, match, referee] = await Promise.all([
    matchRefereeRepository.findByRefereeAndMatch(
      data.referee_id,
      data.match_id,
    ),
    matchRepository.findById(data.match_id),
    refereeRepository.findById(data.referee_id),
  ]);

  if (!referee) {
    throw new NotFoundError(`Referee with id ${data.referee_id} not found`);
  }
  if (referee.is_retired) {
    throw new UnprocessableEntityError(
      "This referee is retired and not available for assignment",
    );
  }
  if (!match) {
    throw new NotFoundError(`Match with id ${data.match_id} not found`);
  }
  if (existing) {
    throw new ConflictError(
      `This referee already has a role: ${existing.role} in this match`,
    );
  }

  const isAssignable =
    match.status === Match_status.SCHEDULED ||
    match.status === Match_status.POSTPONED;
  if (!isAssignable) {
    throw new UnprocessableEntityError(
      `You Can't assign referee to this match as match is ${match.status}`,
    );
  }
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
): Promise<void> => {
  await matchRefereeRepository.unAssign(data);
};
