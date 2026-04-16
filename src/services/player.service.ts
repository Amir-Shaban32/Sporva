import { Positions } from "../../generated/prisma";
import { playerRepository } from "../repositories";
import { PlayerSearchInput, IPlayer, ICreatePlayer } from "../types";
import { Prisma } from "../../generated/prisma";
import { ConflictError, NotFoundError } from "../errors/app-error";

export const createPlayerService = async (
  data: ICreatePlayer,
): Promise<IPlayer> => {
  const existing = await playerRepository.findByJerseyAndTeam(
    data.jersey_number,
    data.team_id,
  );
  if (existing) {
    throw new ConflictError("Jersey number already taken in this team");
  }
  const player = await playerRepository.create(data);
  return player;
};

export const getPlayerByNameService = async (
  name: PlayerSearchInput,
): Promise<IPlayer[]> => {
  const players = await playerRepository.findByName(name);
  if (!players.length) {
    throw new NotFoundError("No players found");
  }
  return players;
};

export const getPlayerByTeamService = async (
  team_id: string,
): Promise<IPlayer[]> => {
  const players = await playerRepository.findByTeam(team_id);
  if (!players.length) {
    throw new NotFoundError("No players found");
  }
  return players;
};

export const getPlayerByPositionService = async (
  position: Positions,
): Promise<IPlayer[]> => {
  const players = await playerRepository.findByPosition(position);
  if (!players.length) {
    throw new NotFoundError("No players found");
  }
  return players;
};

export const getPlayerByNationalityService = async (
  nationality: string,
): Promise<IPlayer[]> => {
  const players = await playerRepository.findByNationality(nationality);
  if (!players.length) {
    throw new NotFoundError("No players found");
  }
  return players;
};

export const updatePlayerService = async (
  id: string,
  data: Prisma.PlayersUpdateInput,
): Promise<IPlayer> => {
  const existing = await playerRepository.findById(id);

  if (!existing) {
    throw new NotFoundError("Player not found");
  }
  const player = await playerRepository.update(id, data);

  return player;
};

export const deletePlayerService = async (id: string): Promise<IPlayer> => {
  const existing = await playerRepository.findById(id);

  if (!existing) {
    throw new NotFoundError("Player not found");
  }
  const player = await playerRepository.delete(id);
  return player;
};

export const countPlayerService = async (): Promise<number> => {
  const players = await playerRepository.count();
  return players;
};
