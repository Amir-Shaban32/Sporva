import { teamRepository } from "../repositories";
import { Prisma } from "../../generated/prisma";
import { ITeam, ICreateTeam } from "../types";
import { ConflictError, NotFoundError } from "../errors/app-error";

export const createTeamService = async (data: ICreateTeam): Promise<ITeam> => {
  const existing = await teamRepository.findByName(data.name);
  if (existing) {
    throw new ConflictError("Team already exists");
  }
  const team = await teamRepository.create(data);
  return team;
};

export const getTeamByIdService = async (id: string): Promise<ITeam> => {
  const existing = await teamRepository.findById(id);
  if (!existing) {
    throw new NotFoundError("Not found!");
  }
  return existing;
};

export const getTeamByNameService = async (name: string): Promise<ITeam> => {
  const existing = await teamRepository.findByName(name);
  if (!existing) {
    throw new NotFoundError("Not found!");
  }
  return existing;
};

export const getRefereeByCityService = async (
  city: string,
): Promise<ITeam[]> => {
  const teams = await teamRepository.findByCity(city);
  if (!teams.length) {
    throw new NotFoundError("No Teams found");
  }
  return teams;
};

export const updateTeamService = async (
  id: string,
  data: Prisma.RefereesUpdateInput,
): Promise<ITeam> => {
  const existing = await teamRepository.findById(id);

  if (!existing) {
    throw new NotFoundError("Team not found");
  }
  const team = await teamRepository.update(id, data);

  return team;
};

export const deleteTeamService = async (id: string): Promise<ITeam> => {
  const existing = await teamRepository.findById(id);

  if (!existing) {
    throw new NotFoundError("Team not found");
  }
  const team = await teamRepository.delete(id);

  return team;
};

export const countTeamService = async (): Promise<number> => {
  const teams = await teamRepository.count();
  return teams;
};
