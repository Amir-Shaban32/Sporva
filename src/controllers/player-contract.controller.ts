import { Request, Response } from "express";
import { catchAsync } from "../utils/catch-async";
import { BadRequestError } from "../errors/app-error";
import {
  createPlayerContractService,
  getActivePlayerContractsService,
  getExpiredPlayerContractsService,
  getPlayerContractsByPlayerService,
  deActivatePlayerContractService,
  getPlayerContractsByIntervalService,
} from "../services";

export const createPlayerContract = catchAsync(
  async (req: Request, res: Response) => {
    const contract = await createPlayerContractService(req.body);
    return res.created("Player contract created successfully", { contract });
  },
);

export const getActivePlayerContracts = catchAsync(
  async (_req: Request, res: Response) => {
    const contracts = await getActivePlayerContractsService();
    return res.ok("Active player contracts retrieved successfully", {
      contracts,
    });
  },
);

export const getExpiredPlayerContracts = catchAsync(
  async (_req: Request, res: Response) => {
    const contracts = await getExpiredPlayerContractsService();
    return res.ok("Expired player contracts retrieved successfully", {
      contracts,
    });
  },
);

export const getPlayerContractsByPlayer = catchAsync(
  async (req: Request, res: Response) => {
    const { player_id } = req.params;
    if (!player_id) {
      throw new BadRequestError("Bad request! Player ID is required");
    }

    const contracts = await getPlayerContractsByPlayerService(
      player_id as string,
    );
    return res.ok("Player contracts retrieved successfully", { contracts });
  },
);

export const deActivatePlayerContract = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
      throw new BadRequestError("Bad request! ID is required");
    }

    await deActivatePlayerContractService(id as string);
    return res.ok("Contract deactivated successfully");
  },
);

export const getPlayerContractsByInterval = catchAsync(
  async (req: Request, res: Response) => {
    const { period } = req.query;
    if (!period) {
      throw new BadRequestError("Bad request! Period is required");
    }

    const contracts = await getPlayerContractsByIntervalService(
      parseInt(period as string),
    );
    return res.ok("Player contracts retrieved successfully", { contracts });
  },
);
