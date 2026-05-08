import { IReferee, ICreateReferee, RefereeSearchInput } from "./referee.types";
import { refereeRepository } from "./referee.repository";
import { Prisma } from "@generated/prisma";
import {
  ConflictError,
  NotFoundError,
  UnprocessableEntityError,
} from "@shared/errors/app-error";
import { checkValidUpdateMember } from "@shared/utils/check-update-member";

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

export const getAllRefereesService = async (
  page: number = 1,
  limit: number = 10,
): Promise<{ referees: IReferee[]; total: number } | null> => {
  const total = await refereeRepository.count();

  if (total > 0 && page > Math.ceil(total / limit)) {
    throw new UnprocessableEntityError(
      `Page ${page} does not exist. Total pages: ${Math.ceil(total / limit)}`,
    );
  }

  const referees = await refereeRepository.findAll(page, limit);
  if (!referees.length) return null;
  return { referees, total };
};

export const getRefereeByIdService = async (id: string): Promise<IReferee> => {
  const existing = await refereeRepository.findById(id);
  if (!existing) {
    throw new NotFoundError("Referee Not found!");
  }
  return existing;
};

export const getRefereeByNameService = async (
  name: RefereeSearchInput,
): Promise<IReferee[] | null> => {
  const referees = await refereeRepository.findByName(name);
  if (!referees.length) return null;

  return referees;
};

export const getRefereeByNationalityService = async (
  nationality: string,
): Promise<IReferee[] | null> => {
  const referees = await refereeRepository.findByNationality(nationality);
  if (!referees.length) return null;

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
  checkValidUpdateMember(data, existing);
  const referee = await refereeRepository.update(id, data);

  return referee;
};

export const deleteRefereeService = async (id: string): Promise<void> => {
  await refereeRepository.delete(id);
};

export const countRefereeService = async (): Promise<number> => {
  const referees = await refereeRepository.count();
  return referees;
};
