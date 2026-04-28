import { ConflictError, UnprocessableEntityError } from "src/errors/app-error";
import { IMatch } from "../types";

export const checkValidRecordResult = (match: IMatch) => {
  const isFinished = match.status === "FINISHED";
  const isLeague = match.competition === "LEAGUE";

  if (isFinished) throw new ConflictError("This match already handled!");
  if (!isLeague)
    throw new UnprocessableEntityError(
      "To edit League standing the match must be in LEAGUE",
    );
};
