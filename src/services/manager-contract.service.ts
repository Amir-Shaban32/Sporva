import { managerContractRepository } from "../repositories";
import { IManagerContract, ICreateManagerContract } from "../types";
import { NotFoundError } from "../errors/app-error";

export const createManagerContractService = async (
  data: ICreateManagerContract,
): Promise<IManagerContract> => {
  const contract = await managerContractRepository.create(data);
  return contract;
};

export const getActiveManagerContractsService = async (): Promise<
  IManagerContract[]
> => {
  const contracts = await managerContractRepository.findActiveContracts();
  if (!contracts.length) {
    throw new NotFoundError("No active contracts found");
  }
  return contracts;
};

export const getExpiredManagerContractsService = async (): Promise<
  IManagerContract[]
> => {
  const contracts = await managerContractRepository.findExpiredContracts();
  if (!contracts.length) {
    throw new NotFoundError("No expired contracts found");
  }
  return contracts;
};

export const getManagerContractsByManagerService = async (
  manager_id: string,
): Promise<IManagerContract[]> => {
  const contracts = await managerContractRepository.findByManager(manager_id);
  if (!contracts.length) {
    throw new NotFoundError("No contracts found");
  }
  return contracts;
};

export const deActivateManagerContractService = async (
  id: string,
): Promise<IManagerContract> => {
  const contract = await managerContractRepository.deActivate(id);
  return contract;
};

export const getManagerContractsByIntervalService = async (
  period: number,
): Promise<IManagerContract[]> => {
  const contracts = await managerContractRepository.findByInterval(period);
  if (!Array.isArray(contracts) || contracts.length === 0) {
    throw new NotFoundError("No contracts found");
  }
  return contracts as IManagerContract[];
};
