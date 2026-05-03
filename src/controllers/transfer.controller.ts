import { Request, Response } from "express";
import { catchAsync } from "../utils/catch-async";
import { BadRequestError } from "../errors/app-error";
import {
  countTransfersService,
  createTransferService,
  getAllTransService,
  getTransfersByPlayerService,
  getTransfersByTeamService,
} from "../services";
import { parsePagination } from "../utils/parse-pagination";

export const createTransfer = catchAsync(
  async (req: Request, res: Response) => {
    const transfer = await createTransferService(req.body);
    return res.created("Transfer created successfully", { transfer });
  },
);

export const getAllTrans = catchAsync(async (req: Request, res: Response) => {
  const { page, limit } = parsePagination(req);

  const result = await getAllTransService(page, limit);
  if (!result) return res.noContent();

  const { transfers, total } = result;

  return res.paginated(
    transfers,
    total,
    page,
    limit,
    "Transfers retrieved successfully",
  );
});

export const getTransfersByPlayer = catchAsync(
  async (req: Request, res: Response) => {
    const { playerId } = req.params;
    if (!playerId) {
      throw new BadRequestError("Bad request! Player ID is required");
    }

    const transfers = await getTransfersByPlayerService(playerId as string);
    if (!transfers) return res.noContent();

    return res.ok("Transfers retrieved successfully", { transfers });
  },
);

export const getTransfersByTeam = catchAsync(
  async (req: Request, res: Response) => {
    const { teamId } = req.params;
    if (!teamId) {
      throw new BadRequestError("Bad request! Team ID is required");
    }

    const transfers = await getTransfersByTeamService(teamId as string);
    if (!transfers) return res.noContent();

    return res.ok("Transfers retrieved successfully", { transfers });
  },
);

export const countTransfers = catchAsync(
  async (_req: Request, res: Response) => {
    const transfers = await countTransfersService();
    return res.ok("Transfers count retrieved successfully", { transfers });
  },
);
