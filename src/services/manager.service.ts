import { managerRepository } from "../repositories";
import { ManagerSearchInput, IManager, ICreateManager } from "../types";
import { Prisma } from "../../generated/prisma";
import { ConflictError, NotFoundError } from "../errors/app-error";

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

export const getManagerByNameService = async (
  name: ManagerSearchInput,
): Promise<IManager[]> => {
  const managers = await managerRepository.findByName(name);
  if (!managers.length) {
    throw new NotFoundError("No managers found");
  }
  return managers;
};

export const getManagerByNationalityService = async (
  nationality: string,
): Promise<IManager[]> => {
  const managers = await managerRepository.findByNationality(nationality);
  if (!managers.length) {
    throw new NotFoundError("No managers found");
  }
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
  const manager = await managerRepository.update(id, data);

  return manager;
};

export const deleteManagerService = async (id: string): Promise<IManager> => {
  const existing = await managerRepository.findById(id);

  if (!existing) {
    throw new NotFoundError("Manager not found");
  }
  const manager = await managerRepository.delete(id);

  return manager;
};

export const countManagerService = async (): Promise<number> => {
  const players = await managerRepository.count();
  return players;
};
