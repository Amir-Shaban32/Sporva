import {
  ServiceResult,
  IReferee,
  ICreateReferee,
  RefereeSearchInput,
} from "../types";
import { refereeRepository } from "../repositories";
import { Prisma } from "../../generated/prisma";

export const createRefereeService = async (
  data: ICreateReferee,
): Promise<ServiceResult<IReferee>> => {
  try {
    const existing = await refereeRepository.findByNameAndBirthDate(
      data.first_name,
      data.last_name,
      data.birth_date,
    );
    if (!existing)
      return {
        success: false,
        error: "Referee already exists",
        code: "CONFLICT",
      };
    const referee = await refereeRepository.create(data);
    return { success: true, data: referee };
  } catch (error) {
    return { success: false, code: "DB_ERROR", error: "Database error" };
  }
};

export const getRefereeByIdService = async (
  id: string,
): Promise<ServiceResult<IReferee>> => {
  try {
    const existing = await refereeRepository.findById(id);
    if (!existing)
      return { success: false, error: "Not found!", code: "NOT_FOUND" };
    return { success: true, data: existing };
  } catch (error) {
    return { success: false, code: "DB_ERROR", error: "Database error" };
  }
};

export const getRefereeByNameService = async (
  name: RefereeSearchInput,
): Promise<ServiceResult<IReferee[]>> => {
  try {
    const existing = await refereeRepository.findByName(name);
    if (!existing)
      return { success: false, error: "Not found!", code: "NOT_FOUND" };
    return { success: true, data: existing };
  } catch (error) {
    return { success: false, code: "DB_ERROR", error: "Database error" };
  }
};

export const getRefereeByNationalityService = async (
  nationality: string,
): Promise<ServiceResult<IReferee[]>> => {
  try {
    const referees = await refereeRepository.findByNationality(nationality);
    if (!referees.length)
      return { success: false, error: "No Referees found", code: "NOT_FOUND" };
    return { success: true, data: referees };
  } catch (error) {
    return { success: false, error: "Database error", code: "DB_ERROR" };
  }
};

export const updateRefereeService = async (
  id: string,
  data: Prisma.RefereesUpdateInput,
): Promise<ServiceResult<IReferee>> => {
  try {
    const existing = await refereeRepository.findById(id);

    if (!existing) {
      return { success: false, error: "Referee not found", code: "NOT_FOUND" };
    }
    const referee = await refereeRepository.update(id, data);

    return { success: true, data: referee };
  } catch (error) {
    return { success: false, error: "Database error", code: "DB_ERROR" };
  }
};

export const deleteRefereeService = async (
  id: string,
): Promise<ServiceResult<IReferee>> => {
  try {
    const existing = await refereeRepository.findById(id);

    if (!existing) {
      return { success: false, error: "Referee not found", code: "NOT_FOUND" };
    }
    const referee = await refereeRepository.delete(id);

    return { success: true, data: referee };
  } catch (error) {
    return { success: false, error: "Database error", code: "DB_ERROR" };
  }
};

export const countRefereeService = async (): Promise<ServiceResult<number>> => {
  try {
    const referees = await refereeRepository.count();
    return { success: true, data: referees };
  } catch (error) {
    return { success: false, error: "Database error", code: "DB_ERROR" };
  }
};
