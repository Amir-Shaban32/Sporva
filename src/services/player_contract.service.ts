import { playerContractRepository } from "../repositories/player_contract.repository";
import {
  ServiceResult,
  IPlayerContract,
  ICreatePlayerContract,
} from "../types";

export const createPlayerContractService = async (
  data: ICreatePlayerContract,
): Promise<ServiceResult<IPlayerContract>> => {
  try {
    const contract = await playerContractRepository.create(data);
    return { success: true, data: contract };
  } catch (error) {
    return { success: false, code: "DB_ERROR", error: "Database error" };
  }
};

export const getActivePlayerContractsService = async (): Promise<
  ServiceResult<IPlayerContract[]>
> => {
  try {
    const contracts = await playerContractRepository.findActiveContracts();
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

export const getExpiredPlayerContractsService = async (): Promise<
  ServiceResult<IPlayerContract[]>
> => {
  try {
    const contracts = await playerContractRepository.findExpiredContracts();
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

export const getPlayerContractsByPlayerService = async (
  player_id: string,
): Promise<ServiceResult<IPlayerContract[]>> => {
  try {
    const contracts = await playerContractRepository.findByPlayer(player_id);
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

export const deActivatePlayerContractService = async (
  id: string,
): Promise<ServiceResult<IPlayerContract>> => {
  try {
    const contract = await playerContractRepository.deActivate(id);
    return { success: true, data: contract };
  } catch (error) {
    return { success: false, code: "DB_ERROR", error: "Database error" };
  }
};

export const getPlayerContractsByIntervalService = async (
  period: number,
): Promise<ServiceResult<IPlayerContract[]>> => {
  try {
    const contracts = await playerContractRepository.findByInterval(period);
    if (!Array.isArray(contracts) || contracts.length === 0)
      return {
        success: false,
        error: "No contracts found",
        code: "NOT_FOUND",
      };
    return { success: true, data: contracts as IPlayerContract[] };
  } catch (error) {
    return { success: false, code: "DB_ERROR", error: "Database error" };
  }
};
