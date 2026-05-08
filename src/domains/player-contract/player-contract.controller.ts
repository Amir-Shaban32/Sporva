import { Request, Response } from "express";
import { catchAsync } from "@shared/utils/catch-async";
import { BadRequestError } from "@shared/errors/app-error";
import {
  createPlayerContractService,
  getActivePlayerContractsService,
  getExpiredPlayerContractsService,
  getPlayerContractsByPlayerService,
  deActivatePlayerContractService,
  getPlayerContractsByIntervalService,
  getAllPlayerContractsService,
  countPlayerContractsService,
} from "./player-contract.service";
import { parsePagination } from "@shared/utils/parse-pagination";
import { parsePeriod } from "@shared/utils/parse-period";

export const createPlayerContract = catchAsync(
  async (req: Request, res: Response) => {
    const contract = await createPlayerContractService(req.body);
    return res.created("Player contract created successfully", { contract });
  },
);

export const getAllPlayerContracts = catchAsync(
  async (req: Request, res: Response) => {
    const { page, limit } = parsePagination(req);

    const result = await getAllPlayerContractsService(page, limit);
    if (!result) return res.noContent();

    const { playerContracts, total } = result;

    return res.paginated(
      playerContracts,
      total,
      page,
      limit,
      "Player Contracts retrieved successfully",
    );
  },
);

export const getActivePlayerContracts = catchAsync(
  async (_req: Request, res: Response) => {
    const contracts = await getActivePlayerContractsService();
    if (!contracts) return res.noContent();

    return res.ok("Active player contracts retrieved successfully", {
      contracts,
    });
  },
);

export const getExpiredPlayerContracts = catchAsync(
  async (_req: Request, res: Response) => {
    const contracts = await getExpiredPlayerContractsService();
    if (!contracts) return res.noContent();

    return res.ok("Expired player contracts retrieved successfully", {
      contracts,
    });
  },
);

export const getPlayerContractsByPlayer = catchAsync(
  async (req: Request, res: Response) => {
    const { playerId } = req.params;
    if (!playerId) {
      throw new BadRequestError("Bad request! Player ID is required");
    }

    const contracts = await getPlayerContractsByPlayerService(
      playerId as string,
    );
    if (!contracts) return res.noContent();

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
    const period = parsePeriod(req);
    if (!period) {
      throw new BadRequestError("Bad request! Period is required");
    }

    const contracts = await getPlayerContractsByIntervalService(period);
    if (!contracts) return res.noContent();

    return res.ok("Player contracts retrieved successfully", { contracts });
  },
);

export const countPlayerContracts = catchAsync(
  async (_req: Request, res: Response) => {
    const count = await countPlayerContractsService();
    return res.ok("Player Contracts count retrieved successfully", { count });
  },
);
