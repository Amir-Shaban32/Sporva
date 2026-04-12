import { Request, Response } from "express";
import { SERVICE_ERROR_STATUS } from "../config";
import {
  createTransferService,
  getTransfersByPlayerService,
  getTransfersByTeamService,
} from "../services";

export const createTransfer = async (req: Request, res: Response) => {
  const data = req.body;

  const result = await createTransferService(data);

  if (!result.success) {
    return res
      .status(SERVICE_ERROR_STATUS[result.code ?? "DB_ERROR"])
      .json({ message: result.error });
  }

  return res.status(201).json({ transfer: result.data });
};

export const getTransfersByPlayer = async (req: Request, res: Response) => {
  const { player_id } = req.params;
  if (!player_id) {
    return res.status(400).json({ message: "Bad request!" });
  }

  const result = await getTransfersByPlayerService(player_id as string);

  if (!result.success) {
    return res
      .status(SERVICE_ERROR_STATUS[result.code ?? "DB_ERROR"])
      .json({ message: result.error });
  }

  return res.status(200).json({ transfers: result.data });
};

export const getTransfersByTeam = async (req: Request, res: Response) => {
  const { team_id } = req.params;
  if (!team_id) {
    return res.status(400).json({ message: "Bad request!" });
  }

  const result = await getTransfersByTeamService(team_id as string);

  if (!result.success) {
    return res
      .status(SERVICE_ERROR_STATUS[result.code ?? "DB_ERROR"])
      .json({ message: result.error });
  }

  return res.status(200).json({ transfers: result.data });
};
