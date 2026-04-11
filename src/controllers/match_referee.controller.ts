import { Request, Response } from "express";
import { SERVICE_ERROR_STATUS } from "../config/http-status.config";
import {
  assignRefereeToMatchService,
  getRefereesByMatchService,
  getMatchesByRefereeService,
  unAssignRefereeFromMatchService,
} from "../services/match_referee.service";
import { Referee_role } from "../../generated/prisma";

export const assignRefereeToMatch = async (req: Request, res: Response) => {
  const data = req.body;
  if (!data.match_id || !data.referee_id) {
    return res.status(400).json({
      message: "Missing required fields for referee assignment!",
    });
  }

  const result = await assignRefereeToMatchService(data);

  if (!result.success) {
    return res
      .status(SERVICE_ERROR_STATUS[result.code ?? "DB_ERROR"])
      .json({ message: result.error });
  }

  return res.status(201).json({ assignment: result.data });
};

export const getRefereesByMatch = async (req: Request, res: Response) => {
  const { match_id } = req.query;
  if (!match_id) {
    return res.status(400).json({ message: "Bad request!" });
  }

  const result = await getRefereesByMatchService(match_id as string);

  if (!result.success) {
    return res
      .status(SERVICE_ERROR_STATUS[result.code ?? "DB_ERROR"])
      .json({ message: result.error });
  }

  return res.status(200).json({ referees: result.data });
};

export const getMatchesByReferee = async (req: Request, res: Response) => {
  const { referee_id } = req.query;
  if (!referee_id) {
    return res.status(400).json({ message: "Bad request!" });
  }

  const result = await getMatchesByRefereeService(referee_id as string);

  if (!result.success) {
    return res
      .status(SERVICE_ERROR_STATUS[result.code ?? "DB_ERROR"])
      .json({ message: result.error });
  }

  return res.status(200).json({ matches: result.data });
};

export const unAssignRefereeFromMatch = async (req: Request, res: Response) => {
  const { match_id, referee_id, role } = req.query;
  if (!match_id || !referee_id || !role) {
    return res.status(400).json({ message: "Bad request!" });
  }

  const result = await unAssignRefereeFromMatchService({
    match_id: match_id as string,
    referee_id: referee_id as string,
    role: role as Referee_role,
  });

  if (!result.success) {
    return res
      .status(SERVICE_ERROR_STATUS[result.code ?? "DB_ERROR"])
      .json({ message: result.error });
  }

  return res
    .status(200)
    .json({ message: "Referee unassigned from match successfully" });
};
