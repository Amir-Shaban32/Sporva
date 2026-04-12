import { Request, Response } from "express";
import { SERVICE_ERROR_STATUS } from "../config";
import {
  createMatchEventService,
  getMatchEventsByMatchService,
  getMatchEventsByTypeService,
  getMatchEventsByPlayerService,
  deleteMatchEventService,
} from "../services";
import { Event_types } from "../../generated/prisma";

export const createMatchEvent = async (req: Request, res: Response) => {
  const data = req.body;

  const result = await createMatchEventService(data);

  if (!result.success) {
    return res
      .status(SERVICE_ERROR_STATUS[result.code ?? "DB_ERROR"])
      .json({ message: result.error });
  }

  return res.status(201).json({ event: result.data });
};

export const getMatchEventsByMatch = async (req: Request, res: Response) => {
  const { match_id } = req.params;
  if (!match_id) {
    return res.status(400).json({ message: "Bad request!" });
  }

  const result = await getMatchEventsByMatchService(match_id as string);

  if (!result.success) {
    return res
      .status(SERVICE_ERROR_STATUS[result.code ?? "DB_ERROR"])
      .json({ message: result.error });
  }

  return res.status(200).json({ events: result.data });
};

export const getMatchEventsByType = async (req: Request, res: Response) => {
  const { event_type } = req.query;
  if (!event_type) {
    return res.status(400).json({ message: "Bad request!" });
  }

  const result = await getMatchEventsByTypeService(event_type as Event_types);

  if (!result.success) {
    return res
      .status(SERVICE_ERROR_STATUS[result.code ?? "DB_ERROR"])
      .json({ message: result.error });
  }

  return res.status(200).json({ events: result.data });
};

export const getMatchEventsByPlayer = async (req: Request, res: Response) => {
  const { player_id } = req.params;
  if (!player_id) {
    return res.status(400).json({ message: "Bad request!" });
  }

  const result = await getMatchEventsByPlayerService(player_id as string);

  if (!result.success) {
    return res
      .status(SERVICE_ERROR_STATUS[result.code ?? "DB_ERROR"])
      .json({ message: result.error });
  }

  return res.status(200).json({ events: result.data });
};

export const deleteMatchEvent = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "Bad request!" });
  }

  const result = await deleteMatchEventService(id as string);

  if (!result.success) {
    return res
      .status(SERVICE_ERROR_STATUS[result.code ?? "DB_ERROR"])
      .json({ message: result.error });
  }

  return res.status(200).json({ message: "Match event deleted successfully" });
};
