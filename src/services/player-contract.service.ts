import {
  playerContractRepository,
  playerRepository,
  teamRepository,
} from "../repositories";
import { IPlayerContract, ICreatePlayerContract } from "../types";
import { NotFoundError } from "../errors/app-error";
import { BadRequestError } from "../errors/app-error";
import { checkContractOverlap } from "../utils/contract-validation";

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

export const getAllPlayerContractsService = async (
  page: number = 1,
  limit: number = 10,
): Promise<{ playerContracts: IPlayerContract[]; total: number }> => {
  const total = await playerContractRepository.count();

  if (total > 0 && page > Math.ceil(total / limit)) {
    throw new BadRequestError(
      `Page ${page} does not exist. Total pages: ${Math.ceil(total / limit)}`,
    );
  }

  const playerContracts = await playerContractRepository.findAll(page, limit);
  if (!playerContracts.length) {
    throw new NotFoundError("No Player Contracts found!");
  }
  return { playerContracts, total };
};

export const getActivePlayerContractsService = async (): Promise<
  IPlayerContract[]
> => {
  const contracts = await playerContractRepository.findActiveContracts();
  if (!contracts.length) {
    throw new NotFoundError("No active contracts found");
  }
  return contracts;
};

export const getExpiredPlayerContractsService = async (): Promise<
  IPlayerContract[]
> => {
  const contracts = await playerContractRepository.findExpiredContracts();
  if (!contracts.length) {
    throw new NotFoundError("No expired contracts found");
  }
  return contracts;
};

export const getPlayerContractsByPlayerService = async (
  player_id: string,
): Promise<IPlayerContract[]> => {
  const player = await playerRepository.findById(player_id);
  if (!player) {
    throw new NotFoundError("Player not found");
  }
  const contracts = await playerContractRepository.findByPlayer(player_id);
  if (!contracts.length) {
    throw new NotFoundError("No contracts found");
  }
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
): Promise<IPlayerContract[]> => {
  const contracts = await playerContractRepository.findByInterval(period);
  if (!Array.isArray(contracts) || contracts.length === 0) {
    throw new NotFoundError("No contracts found");
  }
  return contracts as IPlayerContract[];
};

export const countPlayerContractsService = async (): Promise<number> => {
  const contracts = await playerContractRepository.count();
  return contracts;
};
