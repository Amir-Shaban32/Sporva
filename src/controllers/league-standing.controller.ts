import { Request, Response } from "express";
import { catchAsync } from "../utils/catch-async";
import {
  getLeagueTableService,
  getLeagueTableByMostWinsService,
  getLeagueTableByMostDrawsService,
  getLeagueTableByLeastLossesService,
  getLeagueTableByMostGoalsForService,
  getLeagueTableByLeastGoalsAgainstService,
  getLeagueTableByGoalsDifferenceService,
} from "../services";

export const getLeagueTable = catchAsync(
  async (_req: Request, res: Response) => {
    const standings = await getLeagueTableService();
    return res.status(200).json({ standings });
  },
);

export const getLeagueTableByMostWins = catchAsync(
  async (_req: Request, res: Response) => {
    const standings = await getLeagueTableByMostWinsService();
    return res.status(200).json({ standings });
  },
);

export const getLeagueTableByMostDraws = catchAsync(
  async (_req: Request, res: Response) => {
    const standings = await getLeagueTableByMostDrawsService();
    return res.status(200).json({ standings });
  },
);

export const getLeagueTableByLeastLosses = catchAsync(
  async (_req: Request, res: Response) => {
    const standings = await getLeagueTableByLeastLossesService();
    return res.status(200).json({ standings });
  },
);

export const getLeagueTableByMostGoalsFor = catchAsync(
  async (_req: Request, res: Response) => {
    const standings = await getLeagueTableByMostGoalsForService();
    return res.status(200).json({ standings });
  },
);

export const getLeagueTableByLeastGoalsAgainst = catchAsync(
  async (_req: Request, res: Response) => {
    const standings = await getLeagueTableByLeastGoalsAgainstService();
    return res.status(200).json({ standings });
  },
);

export const getLeagueTableByGoalsDifference = catchAsync(
  async (_req: Request, res: Response) => {
    const standings = await getLeagueTableByGoalsDifferenceService();
    return res.status(200).json({ standings });
  },
);
