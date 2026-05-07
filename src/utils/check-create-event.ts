import { ICreateMatchEvent, IMatch, IPlayer } from "src/types";
import { UnprocessableEntityError, NotFoundError } from "../errors/app-error";

export const checkValidCreateMatchEvent = (
  data: ICreateMatchEvent,
  player: IPlayer,
  match: IMatch,
) => {
  const team = match.guest_team_id ?? match.host_team_id;
  if (!player || !team || !match) {
    const missing = [
      !player && "Player",
      !team && "Team",
      !match && "Match",
    ].filter(Boolean);
    throw new NotFoundError(`${missing.join(", ")} not found`);
  }

  if (player.team_id !== data.team_id) {
    throw new UnprocessableEntityError(
      "Player does not belong to the specified team",
    );
  }

  if (
    data.team_id !== match.host_team_id &&
    data.team_id !== match.guest_team_id
  ) {
    throw new UnprocessableEntityError("Team does not belong to this match");
  }
  if (match.status !== "LIVE") {
    throw new UnprocessableEntityError("Match must be live to add events");
  }
};
