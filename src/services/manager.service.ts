import { managerRepository } from "../repositories/manager.repository";
import {
  ManagerSearchInput,
  ServiceResult,
  IManager,
  ICreateManager,
} from "../types";
import { Prisma } from "../../generated/prisma";

export const createManagerService = async (
  data: ICreateManager,
): Promise<ServiceResult<IManager>> => {
  try {
    const existing = await managerRepository.findByNameAndBirthDate(
      data.first_name,
      data.last_name,
      data.birth_date,
    );
    if (!existing)
      return {
        success: false,
        error: "Manager already exists",
        code: "CONFLICT",
      };
    const manager = await managerRepository.create(data);
    return { success: true, data: manager };
  } catch (error) {
    return { success: false, code: "DB_ERROR", error: "Database error" };
  }
};

export const getManagerByNameService = async (
  name: ManagerSearchInput,
): Promise<ServiceResult<IManager[]>> => {
  try {
    const managers = await managerRepository.findByName(name);
    if (!managers.length)
      return { success: false, error: "No managers found", code: "NOT_FOUND" };
    return { success: true, data: managers };
  } catch (error) {
    return { success: false, error: "Database error", code: "DB_ERROR" };
  }
};

export const getManagerByNationalityService = async (
  nationality: string,
): Promise<ServiceResult<IManager[]>> => {
  try {
    const managers = await managerRepository.findByNationality(nationality);
    if (!managers.length)
      return { success: false, error: "No managers found", code: "NOT_FOUND" };
    return { success: true, data: managers };
  } catch (error) {
    return { success: false, error: "Database error", code: "DB_ERROR" };
  }
};

export const updateManagerService = async (
  id: string,
  data: Prisma.ManagersUpdateInput,
): Promise<ServiceResult<IManager>> => {
  try {
    const existing = await managerRepository.findById(id);

    if (!existing) {
      return { success: false, error: "Manager not found", code: "NOT_FOUND" };
    }
    const manager = await managerRepository.update(id, data);

    return { success: true, data: manager };
  } catch (error) {
    return { success: false, error: "Database error", code: "DB_ERROR" };
  }
};

export const deleteManagerService = async (
  id: string,
): Promise<ServiceResult<IManager>> => {
  try {
    const existing = await managerRepository.findById(id);

    if (!existing) {
      return { success: false, error: "Manager not found", code: "NOT_FOUND" };
    }
    const manager = await managerRepository.delete(id);

    return { success: true, data: manager };
  } catch (error) {
    return { success: false, error: "Database error", code: "DB_ERROR" };
  }
};

export const countManagerService = async (): Promise<ServiceResult<number>> => {
  try {
    const players = await managerRepository.count();
    return { success: true, data: players };
  } catch (error) {
    return { success: false, error: "Database error", code: "DB_ERROR" };
  }
};
