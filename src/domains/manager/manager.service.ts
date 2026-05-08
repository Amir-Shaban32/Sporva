import { managerRepository } from "./manager.repository";
import { ManagerSearchInput, IManager, ICreateManager } from "./manager.types";
import { Prisma } from "@generated/prisma";
import {
  ConflictError,
  NotFoundError,
  UnprocessableEntityError,
} from "@shared/errors/app-error";
import { checkValidUpdateMember } from "@shared/utils/check-update-member";

export const createManagerService = async (
  data: ICreateManager,
): Promise<IManager> => {
  const existing = await managerRepository.findByNameAndBirthDate(
    data.first_name,
    data.last_name,
    data.birth_date,
  );
  if (existing) {
    throw new ConflictError("Manager already exists");
  }
  const manager = await managerRepository.create(data);
  return manager;
};

export const getAllManagersService = async (
  page: number = 1,
  limit: number = 10,
): Promise<{ managers: IManager[]; total: number } | null> => {
  const total = await managerRepository.count();

  if (total > 0 && page > Math.ceil(total / limit)) {
    throw new UnprocessableEntityError(
      `Page ${page} does not exist. Total pages: ${Math.ceil(total / limit)}`,
    );
  }
  const managers = await managerRepository.findAll(page, limit);
  if (!managers.length) return null;

  return { managers, total };
};

export const getManagerByIdService = async (id: string): Promise<IManager> => {
  const manager = await managerRepository.findById(id);
  if (!manager) {
    throw new NotFoundError("Manager not found");
  }
  return manager;
};

export const getManagerByNameService = async (
  name: ManagerSearchInput,
): Promise<IManager[] | null> => {
  const managers = await managerRepository.findByName(name);
  if (!managers.length) return null;

  return managers;
};

export const getManagerByNationalityService = async (
  nationality: string,
): Promise<IManager[] | null> => {
  const managers = await managerRepository.findByNationality(nationality);
  if (!managers.length) return null;
  return managers;
};

export const updateManagerService = async (
  id: string,
  data: Prisma.ManagersUpdateInput,
): Promise<IManager> => {
  const existing = await managerRepository.findById(id);

  if (!existing) {
    throw new NotFoundError("Manager not found");
  }
  checkValidUpdateMember(data, existing);
  const manager = await managerRepository.update(id, data);

  return manager;
};

export const deleteManagerService = async (id: string): Promise<void> => {
  await managerRepository.delete(id);
};

export const countManagerService = async (): Promise<number> => {
  const players = await managerRepository.count();
  return players;
};
