import { IReferee, ICreateReferee, RefereeSearchInput } from "../types";
import { refereeRepository } from "../repositories";
import { Prisma } from "../../generated/prisma";
import { ConflictError, NotFoundError } from "../errors/app-error";

export const createRefereeService = async (
  data: ICreateReferee,
): Promise<IReferee> => {
  const existing = await refereeRepository.findByNameAndBirthDate(
    data.first_name,
    data.last_name,
    data.birth_date,
  );
  if (existing) {
    throw new ConflictError("Referee already exists");
  }
  const referee = await refereeRepository.create(data);
  return referee;
};

export const getRefereeByIdService = async (id: string): Promise<IReferee> => {
  const existing = await refereeRepository.findById(id);
  if (!existing) {
    throw new NotFoundError("Not found!");
  }
  return existing;
};

export const getRefereeByNameService = async (
  name: RefereeSearchInput,
): Promise<IReferee[]> => {
  const existing = await refereeRepository.findByName(name);
  if (!existing) {
    throw new NotFoundError("Not found!");
  }
  return existing;
};

export const getRefereeByNationalityService = async (
  nationality: string,
): Promise<IReferee[]> => {
  const referees = await refereeRepository.findByNationality(nationality);
  if (!referees.length) {
    throw new NotFoundError("No Referees found");
  }
  return referees;
};

export const updateRefereeService = async (
  id: string,
  data: Prisma.RefereesUpdateInput,
): Promise<IReferee> => {
  const existing = await refereeRepository.findById(id);

  if (!existing) {
    throw new NotFoundError("Referee not found");
  }
  const referee = await refereeRepository.update(id, data);

  return referee;
};

export const deleteRefereeService = async (id: string): Promise<IReferee> => {
  const existing = await refereeRepository.findById(id);

  if (!existing) {
    throw new NotFoundError("Referee not found");
  }
  const referee = await refereeRepository.delete(id);

  return referee;
};

export const countRefereeService = async (): Promise<number> => {
  const referees = await refereeRepository.count();
  return referees;
};
