import { Prisma, Match_status, Competitions } from "generated/prisma";
import { IMatch } from "../types";
import { UnprocessableEntityError } from "../errors/app-error";

export const checkValidUpdateMatch = (
  data: Prisma.MatchesUpdateInput,
  match: IMatch,
) => {
  const guest_id = data.guest_team?.connect?.id ?? match.guest_team_id;
  const host_id = data.host_team?.connect?.id ?? match.host_team_id;

  if (guest_id === host_id) {
    throw new UnprocessableEntityError(
      "Host and guest team cannot be the same",
    );
  }

  const guest_score = data.guest_team_score ?? match.guest_team_score;
  const host_score = data.host_team_score ?? match.host_team_score;
  const match_status = data.status ?? match.status;
  const gotExtra = data.got_extra_time ?? match.got_extra_time;
  const gotPenalties = data.got_penalties ?? match.got_penalties;
  const competition = data.competition ?? match.competition;

  const hasEqualScore = guest_score === host_score;
  const isRelevantStatus =
    match_status === Match_status.FINISHED ||
    match_status === Match_status.LIVE;
  const isRelevantComp = competition !== Competitions.LEAGUE;

  if (!isRelevantStatus && (guest_score != null || host_score != null)) {
    throw new UnprocessableEntityError(
      `Score can only be set on LIVE or FINISHED matches. Current status: ${match.status}`,
    );
  }
  if (!isRelevantComp && (gotExtra || gotPenalties)) {
    throw new UnprocessableEntityError(
      `This match in ${competition} You Can't set extra time or penalties`,
    );
  }
  if (!isRelevantStatus && gotExtra) {
    throw new UnprocessableEntityError(
      `Extra time can only be set on LIVE or FINISHED matches. Current status: ${match.status}`,
    );
  }
  if (!isRelevantStatus && gotPenalties) {
    throw new UnprocessableEntityError(
      `Penalties can only be set on LIVE or FINISHED matches. Current status: ${match.status}`,
    );
  }

  if (isRelevantStatus && !hasEqualScore) {
    if (gotExtra) {
      throw new UnprocessableEntityError(
        "Extra time can only be set when scores are equal",
      );
    }

    if (gotPenalties) {
      throw new UnprocessableEntityError(
        "Penalties can only be set when scores are equal",
      );
    }
  }
};
