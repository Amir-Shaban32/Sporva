import { Request, Response } from "express";
import { SERVICE_ERROR_STATUS } from "../config";
import {
  assignRefereeToMatchService,
  getMatchesByRefereeService,
  unAssignRefereeFromMatchService,
} from "../services";
import { Referee_role } from "../../generated/prisma";

export const assignRefereeToMatch = async (req: Request, res: Response) => {
  const data = req.body;

  const result = await assignRefereeToMatchService(data);

  if (!result.success) {
    return res
      .status(SERVICE_ERROR_STATUS[result.code ?? "DB_ERROR"])
      .json({ message: result.error });
  }

  return res.status(201).json({ assignment: result.data });
};

export const getMatchByReferee = async (req: Request, res: Response) => {
  const { referee_id } = req.params;
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
  const { match_id, referee_id, role } = req.body;

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
