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
  async (req: Request, res: Response) => {
    const { season } = req.query;
    const standings = await getLeagueTableService(season as string);
    return res.ok("League table retrieved successfully", { standings });
  },
);

export const getLeagueTableByMostWins = catchAsync(
  async (req: Request, res: Response) => {
    const { season } = req.query;
    const standings = await getLeagueTableByMostWinsService(season as string);
    return res.ok("League table retrieved successfully", { standings });
  },
);

export const getLeagueTableByMostDraws = catchAsync(
  async (req: Request, res: Response) => {
    const { season } = req.query;
    const standings = await getLeagueTableByMostDrawsService(season as string);
    return res.ok("League table retrieved successfully", { standings });
  },
);

export const getLeagueTableByLeastLosses = catchAsync(
  async (req: Request, res: Response) => {
    const { season } = req.query;
    const standings = await getLeagueTableByLeastLossesService(
      season as string,
    );
    return res.ok("League table retrieved successfully", { standings });
  },
);

export const getLeagueTableByMostGoalsFor = catchAsync(
  async (req: Request, res: Response) => {
    const { season } = req.query;
    const standings = await getLeagueTableByMostGoalsForService(
      season as string,
    );
    return res.ok("League table retrieved successfully", { standings });
  },
);

export const getLeagueTableByLeastGoalsAgainst = catchAsync(
  async (req: Request, res: Response) => {
    const { season } = req.query;
    const standings = await getLeagueTableByLeastGoalsAgainstService(
      season as string,
    );
    return res.ok("League table retrieved successfully", { standings });
  },
);

export const getLeagueTableByGoalsDifference = catchAsync(
  async (req: Request, res: Response) => {
    const { season } = req.query;
    const standings = await getLeagueTableByGoalsDifferenceService(
      season as string,
    );
    return res.ok("League table retrieved successfully", { standings });
  },
);
