import { managerContractRepository } from "../repositories";
import { IManagerContract, ICreateManagerContract } from "../types";
import { NotFoundError } from "../errors/app-error";
import { BadRequestError } from "../errors/app-error";

export const createManagerContractService = async (
  data: ICreateManagerContract,
): Promise<IManagerContract> => {
  const contract = await managerContractRepository.create(data);
  return contract;
};

export const getAllManagerContractsService = async (
  page: number = 1,
  limit: number = 10,
): Promise<{ managerContracts: IManagerContract[]; total: number }> => {
  const total = await managerContractRepository.count();

  if (total > 0 && page > Math.ceil(total / limit)) {
    throw new BadRequestError(
      `Page ${page} does not exist. Total pages: ${Math.ceil(total / limit)}`,
    );
  }
  const managerContracts = await managerContractRepository.findAll(page, limit);
  if (!managerContracts.length) {
    throw new NotFoundError("No Manager contracts found!");
  }
  return { managerContracts, total };
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

export const countManagerContractsService = async (): Promise<number> => {
  const contracts = await managerContractRepository.count();
  return contracts;
};
