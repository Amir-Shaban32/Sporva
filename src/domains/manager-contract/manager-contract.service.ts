import { managerContractRepository } from "./manager-contract.repository";
import { managerRepository } from "../manager/manager.repository";
import { teamRepository } from "../team/team.repository";
import {
  IManagerContract,
  ICreateManagerContract,
} from "./manager-contract.types";
import {
  NotFoundError,
  UnprocessableEntityError,
} from "@shared/errors/app-error";
import { checkContractOverlap } from "@shared/utils/contract-validation";

export const createManagerContractService = async (
  data: ICreateManagerContract,
): Promise<IManagerContract> => {
  const [manager, team] = await Promise.all([
    managerRepository.findById(data.manager_id),
    teamRepository.findById(data.team_id),
  ]);

  if (!manager) {
    throw new NotFoundError("Manager not found");
  }
  if (!team) {
    throw new NotFoundError("Team not found");
  }
  const existingContracts =
    await managerContractRepository.findByManagerAndTeam(manager.id, team.id);
  checkContractOverlap(existingContracts, data);
  const contract = await managerContractRepository.create(data);
  return contract;
};

export const getManagerContractByIdService = async (
  id: string,
): Promise<IManagerContract> => {
  const contract = await managerContractRepository.findById(id);
  if (!contract) throw new NotFoundError("Contract not found");
  return contract;
};

export const getAllManagerContractsService = async (
  page: number = 1,
  limit: number = 10,
): Promise<{ managerContracts: IManagerContract[]; total: number } | null> => {
  const total = await managerContractRepository.count();

  if (total > 0 && page > Math.ceil(total / limit)) {
    throw new UnprocessableEntityError(
      `Page ${page} does not exist. Total pages: ${Math.ceil(total / limit)}`,
    );
  }
  const managerContracts = await managerContractRepository.findAll(page, limit);
  if (!managerContracts.length) return null;
  return { managerContracts, total };
};

export const getActiveManagerContractsService = async (): Promise<
  IManagerContract[] | null
> => {
  const contracts = await managerContractRepository.findActiveContracts();
  if (!contracts.length) return null;
  return contracts;
};

export const getExpiredManagerContractsService = async (): Promise<
  IManagerContract[] | null
> => {
  const contracts = await managerContractRepository.findExpiredContracts();
  if (!contracts.length) return null;
  return contracts;
};

export const getManagerContractsByManagerService = async (
  manager_id: string,
): Promise<IManagerContract[] | null> => {
  const contracts = await managerContractRepository.findByManager(manager_id);
  if (!contracts.length) return null;
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
): Promise<IManagerContract[] | null> => {
  const contracts = await managerContractRepository.findByInterval(period);
  if (!Array.isArray(contracts) || contracts.length === 0) return null;
  return contracts as IManagerContract[];
};

export const countManagerContractsService = async (): Promise<number> => {
  const contracts = await managerContractRepository.count();
  return contracts;
};
