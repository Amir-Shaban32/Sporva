import { Request, Response } from "express";
import { catchAsync } from "@shared/utils/catch-async";
import { BadRequestError } from "@shared/errors/app-error";
import {
  assignRefereeToMatchService,
  getMatchesByRefereeService,
  unAssignRefereeFromMatchService,
} from "./match-referee.service";
import { Referee_role } from "@generated/prisma";

export const assignRefereeToMatch = catchAsync(
  async (req: Request, res: Response) => {
    const assignment = await assignRefereeToMatchService(req.body);
    return res.created("Referee assigned to match successfully", {
      assignment,
    });
  },
);

export const getMatchByReferee = catchAsync(
  async (req: Request, res: Response) => {
    const { refereeId } = req.params;
    if (!refereeId) {
      throw new BadRequestError("Bad request! Referee ID is required");
    }

    const assignments = await getMatchesByRefereeService(refereeId as string);
    if (!assignments) return res.noContent();

    return res.ok("Matches retrieved successfully", { assignments });
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
    return res.ok("Referee unassigned from match successfully");
  },
);
