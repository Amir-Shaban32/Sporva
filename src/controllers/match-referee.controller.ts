import { Request, Response } from "express";
import { catchAsync } from "../utils/catch-async";
import { BadRequestError, NotFoundError } from "../errors/app-error";
import {
  assignRefereeToMatchService,
  getMatchesByRefereeService,
  unAssignRefereeFromMatchService,
} from "../services";
import { Referee_role } from "../../generated/prisma";

export const assignRefereeToMatch = catchAsync(
  async (req: Request, res: Response) => {
    const assignment = await assignRefereeToMatchService(req.body);
    return res.status(201).json({ assignment });
  },
);

export const getMatchByReferee = catchAsync(
  async (req: Request, res: Response) => {
    const { referee_id } = req.params;
    if (!referee_id) {
      throw new BadRequestError("Bad request! Referee ID is required");
    }

    const assignments = await getMatchesByRefereeService(referee_id as string);
    return res.status(200).json({ assignments });
  },
);

export const unAssignRefereeFromMatch = catchAsync(
  async (req: Request, res: Response) => {
    const { match_id, referee_id, role } = req.body;

    await unAssignRefereeFromMatchService({
      match_id: match_id as string,
      referee_id: referee_id as string,
      role: role as Referee_role,
    });
    return res
      .status(200)
      .json({ message: "Referee unassigned from match successfully" });
  },
);
