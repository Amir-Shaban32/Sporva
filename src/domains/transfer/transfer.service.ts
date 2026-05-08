import { transferRepository } from "./transfer.repository";
import { playerRepository } from "@domains/player/player.repository";
import { ITransfer, ICreateTransfer } from "./transfer.types";
import {
  NotFoundError,
  UnprocessableEntityError,
} from "@shared/errors/app-error";

export const createTransferService = async (
  data: ICreateTransfer,
): Promise<ITransfer> => {
  const existingPlayer = await playerRepository.findById(data.player_id);
  if (!existingPlayer) {
    throw new NotFoundError("Player not found");
  }
  if (existingPlayer.team_id !== data.from_team_id) {
    throw new UnprocessableEntityError(
      "Player does not belong to the from team",
    );
  }
  if (existingPlayer.team_id === data.to_team_id) {
    throw new UnprocessableEntityError("Player already belongs to the to team");
  }

  const transfer = await transferRepository.createWithPlayerUpdate(
    data,
    existingPlayer,
  );

  return transfer;
};

export const getTransfersByPlayerService = async (
  player_id: string,
): Promise<ITransfer[] | null> => {
  const transfers = await transferRepository.findByPlayer(player_id);
  if (!transfers.length) return null;

  return transfers;
};

export const getAllTransService = async (
  page: number = 1,
  limit: number = 10,
): Promise<{ transfers: ITransfer[]; total: number } | null> => {
  const total = await transferRepository.count();

  if (total > 0 && page > Math.ceil(total / limit)) {
    throw new UnprocessableEntityError(
      `Page ${page} does not exist. Total pages: ${Math.ceil(total / limit)}`,
    );
  }
  const transfers = await transferRepository.findAll(page, limit);
  if (!transfers.length) return null;

  return { transfers, total };
};

export const getTransfersByTeamService = async (
  team_id: string,
): Promise<ITransfer[] | null> => {
  const transfers = await transferRepository.findByTeam(team_id);
  if (!transfers.length) return null;

  return transfers;
};

export const countTransfersService = async (): Promise<number> => {
  const transfers = await transferRepository.count();
  return transfers;
};
