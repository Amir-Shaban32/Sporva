import { Request, Response } from "express";
import { SERVICE_ERROR_STATUS } from "../config";
import {
  scheduleMatchService,
  getMatchByTeamService,
  getLiveMatchesService,
  getMatchesByStatusService,
  getMatchesByCompetitionService,
  getMatchesBySeason,
  updateMatchService,
  getMatchesByDateService,
  getMatchesByRoundService,
  getMatchesWithExtraTimeService,
  getMatchesWithPenaltiesService,
} from "../services";
import { Match_status, Competitions } from "../../generated/prisma";

export const scheduleMatch = async (req: Request, res: Response) => {
  const data = req.body;

  const result = await scheduleMatchService(data);

  if (!result.success) {
    return res
      .status(SERVICE_ERROR_STATUS[result.code ?? "DB_ERROR"])
      .json({ message: result.error });
  }

  return res.status(201).json({ match: result.data });
};

export const getMatchByTeam = async (req: Request, res: Response) => {
  const { team_id } = req.params;
  if (!team_id) {
    return res.status(400).json({ message: "Bad request!" });
  }

  const result = await getMatchByTeamService(team_id as string);

  if (!result.success) {
    return res
      .status(SERVICE_ERROR_STATUS[result.code ?? "DB_ERROR"])
      .json({ message: result.error });
  }

  return res.status(200).json({ matches: result.data });
};

export const getLiveMatches = async (req: Request, res: Response) => {
  const result = await getLiveMatchesService();

  if (!result.success) {
    return res
      .status(SERVICE_ERROR_STATUS[result.code ?? "DB_ERROR"])
      .json({ message: result.error });
  }

  return res.status(200).json({ matches: result.data });
};

export const getMatchesByStatus = async (req: Request, res: Response) => {
  const { status } = req.query;
  if (!status) {
    return res.status(400).json({ message: "Bad request!" });
  }

  const result = await getMatchesByStatusService(status as Match_status);

  if (!result.success) {
    return res
      .status(SERVICE_ERROR_STATUS[result.code ?? "DB_ERROR"])
      .json({ message: result.error });
  }

  return res.status(200).json({ matches: result.data });
};

export const getMatchesByCompetition = async (req: Request, res: Response) => {
  const { competition } = req.query;
  if (!competition) {
    return res.status(400).json({ message: "Bad request!" });
  }

  const result = await getMatchesByCompetitionService(
    competition as Competitions,
  );

  if (!result.success) {
    return res
      .status(SERVICE_ERROR_STATUS[result.code ?? "DB_ERROR"])
      .json({ message: result.error });
  }

  return res.status(200).json({ matches: result.data });
};

export const getMatchesBySeasonEndpoint = async (
  req: Request,
  res: Response,
) => {
  const { season } = req.query;
  if (!season) {
    return res.status(400).json({ message: "Bad request!" });
  }

  const result = await getMatchesBySeason(season as string);

  if (!result.success) {
    return res
      .status(SERVICE_ERROR_STATUS[result.code ?? "DB_ERROR"])
      .json({ message: result.error });
  }

  return res.status(200).json({ matches: result.data });
};

export const getMatchesByDate = async (req: Request, res: Response) => {
  const { date } = req.query;
  if (!date) {
    return res.status(400).json({ message: "Bad request!" });
  }

  const result = await getMatchesByDateService(new Date(date as string));

  if (!result.success) {
    return res
      .status(SERVICE_ERROR_STATUS[result.code ?? "DB_ERROR"])
      .json({ message: result.error });
  }

  return res.status(200).json({ matches: result.data });
};

export const getMatchesByRound = async (req: Request, res: Response) => {
  const { round } = req.query;
  if (!round) {
    return res.status(400).json({ message: "Bad request!" });
  }

  const result = await getMatchesByRoundService(parseInt(round as string));

  if (!result.success) {
    return res
      .status(SERVICE_ERROR_STATUS[result.code ?? "DB_ERROR"])
      .json({ message: result.error });
  }

  return res.status(200).json({ matches: result.data });
};

export const getMatchesWithExtraTime = async (req: Request, res: Response) => {
  const result = await getMatchesWithExtraTimeService();

  if (!result.success) {
    return res
      .status(SERVICE_ERROR_STATUS[result.code ?? "DB_ERROR"])
      .json({ message: result.error });
  }

  return res.status(200).json({ matches: result.data });
};

export const getMatchesWithPenalties = async (req: Request, res: Response) => {
  const result = await getMatchesWithPenaltiesService();

  if (!result.success) {
    return res
      .status(SERVICE_ERROR_STATUS[result.code ?? "DB_ERROR"])
      .json({ message: result.error });
  }

  return res.status(200).json({ matches: result.data });
};

export const updateMatch = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;
  if (!id) return res.status(400).json({ message: "Bad request!" });

  const result = await updateMatchService(id as string, data);

  if (!result.success) {
    return res
      .status(SERVICE_ERROR_STATUS[result.code ?? "DB_ERROR"])
      .json({ message: result.error });
  }

  return res.status(200).json({ match: result.data });
};
