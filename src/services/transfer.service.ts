import {
  playerRepository,
  transferRepository,
  teamRepository,
} from "../repositories";
import { ITransfer, ICreateTransfer } from "../types";
import {
  BadRequestError,
  NotFoundError,
  UnprocessableEntityError,
} from "../errors/app-error";

export const createTransferService = async (
  data: ICreateTransfer,
): Promise<ITransfer> => {
  const existingPlayer = await playerRepository.findById(data.player_id);
  if (!existingPlayer) {
    throw new NotFoundError("Player not found");
  }

  const fromTeam = await teamRepository.findById(data.from_team_id);
  if (!fromTeam) {
    throw new NotFoundError("From team not found");
  }

  const toTeam = await teamRepository.findById(data.to_team_id);
  if (!toTeam) {
    throw new NotFoundError("To team not found");
  }

  if (existingPlayer.team_id !== data.from_team_id) {
    throw new UnprocessableEntityError(
      "Player does not belong to the from team",
    );
  }

  if (existingPlayer.team_id === data.to_team_id) {
    throw new UnprocessableEntityError("Player already belongs to the to team");
  }

  await playerRepository.update(data.player_id, {
    team: {
      connect: { id: data.to_team_id },
    },
  });

  const transfer = await transferRepository.create(data);
  return transfer;
};

export const getTransfersByPlayerService = async (
  player_id: string,
): Promise<ITransfer[]> => {
  const transfers = await transferRepository.findByPlayer(player_id);
  if (!transfers.length) {
    throw new NotFoundError("No transfers found");
  }
  return transfers;
};

export const getAllTransService = async (
  page: number = 1,
  limit: number = 10,
): Promise<{ transfers: ITransfer[]; total: number }> => {
  const total = await transferRepository.count();

  if (total > 0 && page > Math.ceil(total / limit)) {
    throw new BadRequestError(
      `Page ${page} does not exist. Total pages: ${Math.ceil(total / limit)}`,
    );
  }
  const transfers = await transferRepository.findAll(page, limit);
  if (!transfers.length) {
    throw new NotFoundError("No Transfers found!");
  }

  return { transfers, total };
};

export const getTransfersByTeamService = async (
  team_id: string,
): Promise<ITransfer[]> => {
  const transfers = await transferRepository.findByTeam(team_id);
  if (!transfers.length) {
    throw new NotFoundError("No transfers found");
  }
  return transfers;
};

export const countTransfersService = async (): Promise<number> => {
  const transfers = await transferRepository.count();
  return transfers;
};
