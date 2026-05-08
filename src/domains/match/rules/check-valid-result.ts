import { BadRequestError, ConflictError } from "@shared/errors/app-error";
import { IMatch } from "../match.types";

export const checkValidRecordResult = (match: IMatch) => {
  const isFinished = match.status === "FINISHED";
  const isLeague = match.competition === "LEAGUE";

  if (!isLeague)
    throw new BadRequestError(
      "To edit League standing the match must be in LEAGUE",
    );
  if (isFinished) throw new ConflictError("This match already handled!");
};
