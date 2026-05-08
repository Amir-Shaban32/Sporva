import { playerContractRepository } from "./player-contract.repository";
import { playerRepository } from "@domains/player/player.repository";
import { teamRepository } from "@domains/team/team.repository";
import {
  IPlayerContract,
  ICreatePlayerContract,
} from "./player-contract.types";
import {
  NotFoundError,
  UnprocessableEntityError,
} from "@shared/errors/app-error";
import { checkContractOverlap } from "@shared/utils/contract-validation";

export const createPlayerContractService = async (
  data: ICreatePlayerContract,
): Promise<IPlayerContract> => {
  const [player, team] = await Promise.all([
    playerRepository.findById(data.player_id),
    teamRepository.findById(data.team_id),
  ]);

  if (!player) {
    throw new NotFoundError("Player not found");
  }
  if (!team) {
    throw new NotFoundError("Team not found");
  }
  const existingContracts = await playerContractRepository.findByPlayerAndTeam(
    player.id,
    team.id,
  );
  checkContractOverlap(existingContracts, data);
  const contract = await playerContractRepository.create(data);
  return contract;
};

export const getPlayerContractByIdService = async (
  id: string,
): Promise<IPlayerContract> => {
  const contract = await playerContractRepository.findById(id);
  if (!contract) throw new NotFoundError("Contract not found");
  return contract;
};

export const getAllPlayerContractsService = async (
  page: number = 1,
  limit: number = 10,
): Promise<{ playerContracts: IPlayerContract[]; total: number } | null> => {
  const total = await playerContractRepository.count();

  if (total > 0 && page > Math.ceil(total / limit)) {
    throw new UnprocessableEntityError(
      `Page ${page} does not exist. Total pages: ${Math.ceil(total / limit)}`,
    );
  }

  const playerContracts = await playerContractRepository.findAll(page, limit);
  if (!playerContracts.length) return null;
  return { playerContracts, total };
};

export const getActivePlayerContractsService = async (): Promise<
  IPlayerContract[] | null
> => {
  const contracts = await playerContractRepository.findActiveContracts();
  if (!contracts.length) return null;
  return contracts;
};

export const getExpiredPlayerContractsService = async (): Promise<
  IPlayerContract[] | null
> => {
  const contracts = await playerContractRepository.findExpiredContracts();
  if (!contracts.length) return null;
  return contracts;
};

export const getPlayerContractsByPlayerService = async (
  player_id: string,
): Promise<IPlayerContract[] | null> => {
  const player = await playerRepository.findById(player_id);
  if (!player) {
    throw new NotFoundError("Player not found");
  }
  const contracts = await playerContractRepository.findByPlayer(player_id);
  if (!contracts.length) return null;
  return contracts;
};

export const deActivatePlayerContractService = async (
  id: string,
): Promise<IPlayerContract> => {
  const contract = await playerContractRepository.deActivate(id);
  return contract;
};

export const getPlayerContractsByIntervalService = async (
  period: number,
): Promise<IPlayerContract[] | null> => {
  const contracts = await playerContractRepository.findByInterval(period);
  if (!Array.isArray(contracts) || contracts.length === 0) return null;
  return contracts as IPlayerContract[];
};

export const countPlayerContractsService = async (): Promise<number> => {
  const contracts = await playerContractRepository.count();
  return contracts;
};
