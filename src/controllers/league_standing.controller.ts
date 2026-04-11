import { Request, Response } from "express";
import { SERVICE_ERROR_STATUS } from "../config/http-status.config";
import {
  getLeagueTableService,
  getLeagueTableByMostWinsService,
  getLeagueTableByMostDrawsService,
  getLeagueTableByLeastLossesService,
  getLeagueTableByMostGoalsForService,
  getLeagueTableByLeastGoalsAgainstService,
  getLeagueTableByGoalsDifferenceService,
} from "../services/league_standing.service";

export const getLeagueTable = async (req: Request, res: Response) => {
  const result = await getLeagueTableService();

  if (!result.success) {
    return res
      .status(SERVICE_ERROR_STATUS[result.code ?? "DB_ERROR"])
      .json({ message: result.error });
  }

  return res.status(200).json({ standings: result.data });
};

export const getLeagueTableByMostWins = async (req: Request, res: Response) => {
  const result = await getLeagueTableByMostWinsService();

  if (!result.success) {
    return res
      .status(SERVICE_ERROR_STATUS[result.code ?? "DB_ERROR"])
      .json({ message: result.error });
  }

  return res.status(200).json({ standings: result.data });
};

export const getLeagueTableByMostDraws = async (
  req: Request,
  res: Response,
) => {
  const result = await getLeagueTableByMostDrawsService();

  if (!result.success) {
    return res
      .status(SERVICE_ERROR_STATUS[result.code ?? "DB_ERROR"])
      .json({ message: result.error });
  }

  return res.status(200).json({ standings: result.data });
};

export const getLeagueTableByLeastLosses = async (
  req: Request,
  res: Response,
) => {
  const result = await getLeagueTableByLeastLossesService();

  if (!result.success) {
    return res
      .status(SERVICE_ERROR_STATUS[result.code ?? "DB_ERROR"])
      .json({ message: result.error });
  }

  return res.status(200).json({ standings: result.data });
};

export const getLeagueTableByMostGoalsFor = async (
  req: Request,
  res: Response,
) => {
  const result = await getLeagueTableByMostGoalsForService();

  if (!result.success) {
    return res
      .status(SERVICE_ERROR_STATUS[result.code ?? "DB_ERROR"])
      .json({ message: result.error });
  }

  return res.status(200).json({ standings: result.data });
};

export const getLeagueTableByLeastGoalsAgainst = async (
  req: Request,
  res: Response,
) => {
  const result = await getLeagueTableByLeastGoalsAgainstService();

  if (!result.success) {
    return res
      .status(SERVICE_ERROR_STATUS[result.code ?? "DB_ERROR"])
      .json({ message: result.error });
  }

  return res.status(200).json({ standings: result.data });
};

export const getLeagueTableByGoalsDifference = async (
  req: Request,
  res: Response,
) => {
  const result = await getLeagueTableByGoalsDifferenceService();

  if (!result.success) {
    return res
      .status(SERVICE_ERROR_STATUS[result.code ?? "DB_ERROR"])
      .json({ message: result.error });
  }

  return res.status(200).json({ standings: result.data });
};
