import { transferREpository } from "../repositories";
import { ITransfer, ICreateTransfer } from "../types";
import { NotFoundError } from "../errors/app-error";

export const createTransferService = async (
  data: ICreateTransfer,
): Promise<ITransfer> => {
  const transfer = await transferREpository.create(data);
  return transfer;
};

export const getTransfersByPlayerService = async (
  player_id: string,
): Promise<ITransfer[]> => {
  const transfers = await transferREpository.findByPlayer(player_id);
  if (!transfers.length) {
    throw new NotFoundError("No transfers found");
  }
  return transfers;
};

export const getTransfersByTeamService = async (
  team_id: string,
): Promise<ITransfer[]> => {
  const transfers = await transferREpository.findByteam(team_id);
  if (!transfers.length) {
    throw new NotFoundError("No transfers found");
  }
  return transfers;
};
