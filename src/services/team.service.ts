import { teamRepository } from "../repositories";
import { Prisma } from "../../generated/prisma";
import { ITeam, ICreateTeam } from "../types";
import {
  ConflictError,
  NotFoundError,
  UnprocessableEntityError,
} from "../errors/app-error";

export const createTeamService = async (data: ICreateTeam): Promise<ITeam> => {
  const existing = await teamRepository.findByName(data.name);
  if (existing) {
    throw new ConflictError("Team already exists");
  }
  const team = await teamRepository.create(data);
  return team;
};

export const getAllTeamsService = async (
  page: number = 1,
  limit: number = 10,
): Promise<{ teams: ITeam[]; total: number } | null> => {
  const total = await teamRepository.count();

  if (total > 0 && page > Math.ceil(total / limit)) {
    throw new UnprocessableEntityError(
      `Page ${page} does not exist. Total pages: ${Math.ceil(total / limit)}`,
    );
  }

  const teams = await teamRepository.findAll(page, limit);
  if (!teams.length) return null;
  return { teams, total };
};

export const getTeamByIdService = async (id: string): Promise<ITeam> => {
  const existing = await teamRepository.findById(id);
  if (!existing) {
    throw new NotFoundError("Team Not found!");
  }
  return existing;
};

export const getTeamByNameService = async (name: string): Promise<ITeam> => {
  const existing = await teamRepository.findByName(name);
  if (!existing) {
    throw new NotFoundError("Team Not found!");
  }
  return existing;
};

export const getTeamByCityService = async (
  city: string,
): Promise<ITeam[] | null> => {
  const teams = await teamRepository.findByCity(city);
  if (!teams.length) return null;
  return teams;
};

export const updateTeamService = async (
  id: string,
  data: Prisma.TeamsUpdateInput,
): Promise<ITeam> => {
  const team = await teamRepository.update(id, data);
  return team;
};

export const deleteTeamService = async (id: string): Promise<void> => {
  await teamRepository.delete(id);
};

export const countTeamService = async (): Promise<number> => {
  const teams = await teamRepository.count();
  return teams;
};
