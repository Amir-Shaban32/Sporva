import { prisma } from "../lib/prisma";
import { managerContractRepository } from "../repositories/manager_contract.repository";
import {
  ServiceResult,
  IManagerContract,
  ICreateManagerContract,
} from "../types";
import { Prisma } from "../../generated/prisma";

export const createManagerContractService = async (
  data: ICreateManagerContract,
): Promise<ServiceResult<IManagerContract>> => {
  try {
    const contract = await managerContractRepository.create(data);
    return { success: true, data: contract };
  } catch (error) {
    return { success: false, code: "DB_ERROR", error: "Database error" };
  }
};

export const getActiveManagerContractsService = async (): Promise<
  ServiceResult<IManagerContract[]>
> => {
  try {
    const contracts = await managerContractRepository.findActiveContracts();
    if (!contracts.length)
      return {
        success: false,
        error: "No active contracts found",
        code: "NOT_FOUND",
      };
    return { success: true, data: contracts };
  } catch (error) {
    return { success: false, code: "DB_ERROR", error: "Database error" };
  }
};

export const getExpiredManagerContractsService = async (): Promise<
  ServiceResult<IManagerContract[]>
> => {
  try {
    const contracts = await managerContractRepository.findExpiredContracts();
    if (!contracts.length)
      return {
        success: false,
        error: "No expired contracts found",
        code: "NOT_FOUND",
      };
    return { success: true, data: contracts };
  } catch (error) {
    return { success: false, code: "DB_ERROR", error: "Database error" };
  }
};

export const getManagerContractsByManagerService = async (
  manager_id: string,
): Promise<ServiceResult<IManagerContract[]>> => {
  try {
    const contracts = await managerContractRepository.findByManager(manager_id);
    if (!contracts.length)
      return {
        success: false,
        error: "No contracts found",
        code: "NOT_FOUND",
      };
    return { success: true, data: contracts };
  } catch (error) {
    return { success: false, code: "DB_ERROR", error: "Database error" };
  }
};

export const deActivateManagerContractService = async (
  id: string,
): Promise<ServiceResult<IManagerContract>> => {
  try {
    const contract = await managerContractRepository.deActivate(id);
    return { success: true, data: contract };
  } catch (error) {
    return { success: false, code: "DB_ERROR", error: "Database error" };
  }
};

export const getManagerContractsByIntervalService = async (
  period: number,
): Promise<ServiceResult<IManagerContract[]>> => {
  try {
    const contracts = await managerContractRepository.findByInterval(period);
    if (!Array.isArray(contracts) || contracts.length === 0)
      return {
        success: false,
        error: "No contracts found",
        code: "NOT_FOUND",
      };
    return { success: true, data: contracts as IManagerContract[] };
  } catch (error) {
    return { success: false, code: "DB_ERROR", error: "Database error" };
  }
};
