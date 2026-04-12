import { Positions } from "../../generated/prisma";
import { playerRepository } from "../repositories";
import {
  PlayerSearchInput,
  ServiceResult,
  IPlayer,
  ICreatePlayer,
} from "../types";
import { Prisma } from "../../generated/prisma";

export const createPlayerService = async (
  data: ICreatePlayer,
): Promise<ServiceResult<IPlayer>> => {
  try {
    const existing = await playerRepository.findByJerseyAndTeam(
      data.jersey_number,
      data.team_id,
    );
    if (!existing)
      return {
        success: false,
        error: "Jersey number already taken in this team",
        code: "CONFLICT",
      };
    const player = await playerRepository.create(data);
    return { success: true, data: player };
  } catch (error) {
    return { success: false, code: "DB_ERROR", error: "Database error" };
  }
};

export const getPlayerByNameService = async (
  name: PlayerSearchInput,
): Promise<ServiceResult<IPlayer[]>> => {
  try {
    const players = await playerRepository.findByName(name);
    if (!players.length)
      return { success: false, error: "No players found", code: "NOT_FOUND" };
    return { success: true, data: players };
  } catch (error) {
    return { success: false, error: "Database error", code: "DB_ERROR" };
  }
};

export const getPlayerByTeamService = async (
  team_id: string,
): Promise<ServiceResult<IPlayer[]>> => {
  try {
    const players = await playerRepository.findByTeam(team_id);
    if (!players.length)
      return { success: false, error: "No players found", code: "NOT_FOUND" };
    return { success: true, data: players };
  } catch (error) {
    return { success: false, error: "Database error", code: "DB_ERROR" };
  }
};

export const getPlayerByPositionService = async (
  position: Positions,
): Promise<ServiceResult<IPlayer[]>> => {
  try {
    const players = await playerRepository.findByPosition(position);
    if (!players.length)
      return { success: false, error: "No players found", code: "NOT_FOUND" };
    return { success: true, data: players };
  } catch (error) {
    return { success: false, error: "Database error", code: "DB_ERROR" };
  }
};

export const getPlayerByNationalityService = async (
  nationality: string,
): Promise<ServiceResult<IPlayer[]>> => {
  try {
    const players = await playerRepository.findByNationality(nationality);
    if (!players.length)
      return { success: false, error: "No players found", code: "NOT_FOUND" };
    return { success: true, data: players };
  } catch (error) {
    return { success: false, error: "Database error", code: "DB_ERROR" };
  }
};

export const updatePlayerService = async (
  id: string,
  data: Prisma.PlayersUpdateInput,
): Promise<ServiceResult<IPlayer>> => {
  try {
    const existing = await playerRepository.findById(id);

    if (!existing) {
      return { success: false, error: "Player not found", code: "NOT_FOUND" };
    }
    const player = await playerRepository.update(id, data);

    return { success: true, data: player };
  } catch (error) {
    return { success: false, error: "Database error", code: "DB_ERROR" };
  }
};

export const deletePlayerService = async (
  id: string,
): Promise<ServiceResult<IPlayer>> => {
  try {
    const existing = await playerRepository.findById(id);

    if (!existing) {
      return { success: false, error: "Player not found", code: "NOT_FOUND" };
    }
    const player = await playerRepository.delete(id);
    return { success: true, data: player };
  } catch (error) {
    return { success: false, error: "Database error", code: "DB_ERROR" };
  }
};

export const countPlayerService = async (): Promise<ServiceResult<number>> => {
  try {
    const players = await playerRepository.count();
    return { success: true, data: players };
  } catch (error) {
    return { success: false, error: "Database error", code: "DB_ERROR" };
  }
};
