import { Request, Response } from "express";
import { SERVICE_ERROR_STATUS } from "../config/http-status.config";
import {
  getPlayerByNameService,
  getPlayerByTeamService,
  getPlayerByPositionService,
  getPlayerByNationalityService,
  updatePlayerService,
  deletePlayerService,
  countPlayerService,
} from "../services/player.service";
import { Positions } from "../../generated/prisma";

export const findPlayerByName = async (req: Request, res: Response) => {
  const { f_name, l_name } = req.query;
  if (!f_name && !l_name) {
    return res.status(400).json({ message: "Bad request!" });
  }

  const result = await getPlayerByNameService({
    f_name: f_name as string,
    l_name: l_name as string,
  });

  if (!result.success) {
    return res
      .status(SERVICE_ERROR_STATUS[result.code ?? "DB_ERROR"])
      .json({ message: result.error });
  }

  return res.status(200).json({ players: result.data });
};

export const findPlayerByTeam = async (req: Request, res: Response) => {
  const { team_id } = req.query;
  if (!team_id) {
    return res.status(400).json({ message: "Bad request!" });
  }

  const result = await getPlayerByTeamService(team_id as string);

  if (!result.success) {
    return res
      .status(SERVICE_ERROR_STATUS[result.code ?? "DB_ERROR"])
      .json({ message: result.error });
  }

  return res.status(200).json({ players: result.data });
};

export const findPlayerByPosition = async (req: Request, res: Response) => {
  const { position } = req.query;
  if (!position) {
    return res.status(400).json({ message: "Bad request!" });
  }

  const result = await getPlayerByPositionService(position as Positions);

  if (!result.success) {
    return res
      .status(SERVICE_ERROR_STATUS[result.code ?? "DB_ERROR"])
      .json({ message: result.error });
  }

  return res.status(200).json({ players: result.data });
};

export const findPlayerByNationality = async (req: Request, res: Response) => {
  const { nationality } = req.query;
  if (!nationality) {
    return res.status(400).json({ message: "Bad request!" });
  }

  const result = await getPlayerByNationalityService(nationality as string);

  if (!result.success) {
    return res
      .status(SERVICE_ERROR_STATUS[result.code ?? "DB_ERROR"])
      .json({ message: result.error });
  }

  return res.status(200).json({ players: result.data });
};

export const updatePlayer = async (req: Request, res: Response) => {
  const { id } = req.query;
  const data = req.body;
  if (!id) return res.status(400).json({ message: "Bad request!" });

  const result = await updatePlayerService(id as string, data);

  if (!result.success) {
    return res
      .status(SERVICE_ERROR_STATUS[result.code ?? "DB_ERROR"])
      .json({ message: result.error });
  }

  return res.status(200).json({ player: result.data });
};

export const deletePlayer = async (req: Request, res: Response) => {
  const { id } = req.query;
  if (!id) return res.status(400).json({ message: "Bad request!" });

  const result = await deletePlayerService(id as string);

  if (!result.success) {
    return res
      .status(SERVICE_ERROR_STATUS[result.code ?? "DB_ERROR"])
      .json({ message: result.error });
  }

  return res.status(200).json({ player: result.data });
};

export const countPlayers = async (req: Request, res: Response) => {
  const result = await countPlayerService();

  if (!result.success) {
    return res
      .status(SERVICE_ERROR_STATUS[result.code ?? "DB_ERROR"])
      .json({ message: result.error });
  }

  return res.status(200).json({ count: result.data });
};
