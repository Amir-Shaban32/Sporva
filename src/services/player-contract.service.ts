import { playerContractRepository } from "../repositories";
import { IPlayerContract, ICreatePlayerContract } from "../types";
import { NotFoundError } from "../errors/app-error";

export const createPlayerContractService = async (
  data: ICreatePlayerContract,
): Promise<IPlayerContract> => {
  const contract = await playerContractRepository.create(data);
  return contract;
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
