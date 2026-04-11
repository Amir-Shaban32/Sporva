import { teamRepository } from "../repositories/team.repository";
import { Prisma } from "../../generated/prisma";
import { ServiceResult, ITeam, ICreateTeam } from "../types";

export const createTeamService = async (
  data: ICreateTeam,
): Promise<ServiceResult<ITeam>> => {
  try {
    const existing = await teamRepository.findByName(data.name);
    if (!existing)
      return {
        success: false,
        error: "Team already exists",
        code: "CONFLICT",
      };
    const team = await teamRepository.create(data);
    return { success: true, data: team };
  } catch (error) {
    return { success: false, code: "DB_ERROR", error: "Database error" };
  }
};

export const getTeamByIdService = async (
  id: string,
): Promise<ServiceResult<ITeam>> => {
  try {
    const existing = await teamRepository.findById(id);
    if (!existing)
      return { success: false, error: "Not found!", code: "NOT_FOUND" };
    return { success: true, data: existing };
  } catch (error) {
    return { success: false, code: "DB_ERROR", error: "Database error" };
  }
};

export const getTeamByNameService = async (
  name: string,
): Promise<ServiceResult<ITeam>> => {
  try {
    const existing = await teamRepository.findByName(name);
    if (!existing)
      return { success: false, error: "Not found!", code: "NOT_FOUND" };
    return { success: true, data: existing };
  } catch (error) {
    return { success: false, code: "DB_ERROR", error: "Database error" };
  }
};

export const getRefereeByCityService = async (
  city: string,
): Promise<ServiceResult<ITeam[]>> => {
  try {
    const teams = await teamRepository.findByCity(city);
    if (!teams.length)
      return { success: false, error: "No Teams found", code: "NOT_FOUND" };
    return { success: true, data: teams };
  } catch (error) {
    return { success: false, error: "Database error", code: "DB_ERROR" };
  }
};

export const updateTeamService = async (
  id: string,
  data: Prisma.RefereesUpdateInput,
): Promise<ServiceResult<ITeam>> => {
  try {
    const existing = await teamRepository.findById(id);

    if (!existing) {
      return { success: false, error: "Team not found", code: "NOT_FOUND" };
    }
    const team = await teamRepository.update(id, data);

    return { success: true, data: team };
  } catch (error) {
    return { success: false, error: "Database error", code: "DB_ERROR" };
  }
};

export const deleteTeamService = async (
  id: string,
): Promise<ServiceResult<ITeam>> => {
  try {
    const existing = await teamRepository.findById(id);

    if (!existing) {
      return { success: false, error: "Team not found", code: "NOT_FOUND" };
    }
    const team = await teamRepository.delete(id);

    return { success: true, data: team };
  } catch (error) {
    return { success: false, error: "Database error", code: "DB_ERROR" };
  }
};

export const countTeamService = async (): Promise<ServiceResult<number>> => {
  try {
    const teams = await teamRepository.count();
    return { success: true, data: teams };
  } catch (error) {
    return { success: false, error: "Database error", code: "DB_ERROR" };
  }
};
