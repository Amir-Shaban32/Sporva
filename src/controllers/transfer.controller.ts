import { Request, Response } from "express";
import { catchAsync } from "../utils/catch-async";
import { BadRequestError } from "../errors/app-error";
import {
  createTransferService,
  getTransfersByPlayerService,
  getTransfersByTeamService,
} from "../services";

export const createTransfer = catchAsync(
  async (req: Request, res: Response) => {
    const transfer = await createTransferService(req.body);
    return res.created("Transfer created successfully", { transfer });
  },
);

export const getTransfersByPlayer = catchAsync(
  async (req: Request, res: Response) => {
    const { player_id } = req.params;
    if (!player_id) {
      throw new BadRequestError("Bad request! Player ID is required");
    }

    const transfers = await getTransfersByPlayerService(player_id as string);
    return res.ok("Transfers retrieved successfully", { transfers });
  },
);

export const getTransfersByTeam = catchAsync(
  async (req: Request, res: Response) => {
    const { team_id } = req.params;
    if (!team_id) {
      throw new BadRequestError("Bad request! Team ID is required");
    }

    const transfers = await getTransfersByTeamService(team_id as string);
    return res.ok("Transfers retrieved successfully", { transfers });
  },
);
