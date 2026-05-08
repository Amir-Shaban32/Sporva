import { IManager } from "@domains/manager/manager.types";
import { IPlayer } from "@domains/player/player.types";
import { IReferee } from "@domains/referee/referee.types";
import { Prisma } from "@generated/prisma";
import { ConflictError } from "@shared/errors/app-error";

type DataType =
  | Prisma.PlayersUpdateInput
  | Prisma.ManagersUpdateInput
  | Prisma.RefereesUpdateInput;
type Member = IPlayer | IManager | IReferee;

export const checkValidUpdateMember = (data: DataType, member: Member) => {
  const finalIsRetired =
    data.is_retired !== undefined ? data.is_retired : member.is_retired;

  const finalRetiredDate =
    data.retired_date !== undefined ? data.retired_date : member.retired_date;

  if (finalIsRetired === false && finalRetiredDate != null) {
    if (data.retired_date !== undefined && data.is_retired === undefined) {
      throw new ConflictError("Cannot set retired_date for an active player.");
    }
    throw new ConflictError(
      "Cannot activate member while retired_date exists. Set it to null first.",
    );
  }
};
