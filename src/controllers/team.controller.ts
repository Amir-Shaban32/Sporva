import { Request, Response } from "express";
import { SERVICE_ERROR_STATUS } from "../config/http-status.config";
import {
  createTeamService,
  getTeamByIdService,
  getTeamByNameService,
  getRefereeByCityService,
  updateTeamService,
  countTeamService,
  deleteTeamService,
} from "../services/team.service";

export const createTeam = async (req: Request, res: Response) => {
  const data = req.body;
  if (
    !data.name ||
    !data.founded_year ||
    !data.city ||
    !data.stadium ||
    !data.current_manager_id
  ) {
    return res.status(400).json({
      message:
        "name, founded_year, city, stadium, and current_manager_id are required!",
    });
  }

  const result = await createTeamService(data);

  if (!result.success) {
    return res
      .status(SERVICE_ERROR_STATUS[result.code ?? "DB_ERROR"])
      .json({ message: result.error });
  }

  return res.status(201).json({ team: result.data });
};

export const getTeamById = async (req: Request, res: Response) => {
  const { id } = req.query;
  if (!id) {
    return res.status(400).json({ message: "Bad request!" });
  }

  const result = await getTeamByIdService(id as string);

  if (!result.success) {
    return res
      .status(SERVICE_ERROR_STATUS[result.code ?? "DB_ERROR"])
      .json({ message: result.error });
  }

  return res.status(200).json({ team: result.data });
};

export const getTeamByName = async (req: Request, res: Response) => {
  const { name } = req.query;
  if (!name) {
    return res.status(400).json({ message: "Bad request!" });
  }

  const result = await getTeamByNameService(name as string);

  if (!result.success) {
    return res
      .status(SERVICE_ERROR_STATUS[result.code ?? "DB_ERROR"])
      .json({ message: result.error });
  }

  return res.status(200).json({ team: result.data });
};

export const getTeamByCity = async (req: Request, res: Response) => {
  const { city } = req.query;
  if (!city) {
    return res.status(400).json({ message: "Bad request!" });
  }

  const result = await getRefereeByCityService(city as string);

  if (!result.success) {
    return res
      .status(SERVICE_ERROR_STATUS[result.code ?? "DB_ERROR"])
      .json({ message: result.error });
  }

  return res.status(200).json({ teams: result.data });
};

export const updateTeam = async (req: Request, res: Response) => {
  const { id } = req.query;
  const data = req.body;
  if (!id) return res.status(400).json({ message: "Bad request!" });

  const result = await updateTeamService(id as string, data);

  if (!result.success) {
    return res
      .status(SERVICE_ERROR_STATUS[result.code ?? "DB_ERROR"])
      .json({ message: result.error });
  }

  return res.status(200).json({ team: result.data });
};

export const deleteTeam = async (req: Request, res: Response) => {
  const { id } = req.query;
  if (!id) return res.status(400).json({ message: "Bad request!" });

  const result = await deleteTeamService(id as string);

  if (!result.success) {
    return res
      .status(SERVICE_ERROR_STATUS[result.code ?? "DB_ERROR"])
      .json({ message: result.error });
  }

  return res.status(200).json({ team: result.data });
};

export const countTeams = async (req: Request, res: Response) => {
  const result = await countTeamService();

  if (!result.success) {
    return res
      .status(SERVICE_ERROR_STATUS[result.code ?? "DB_ERROR"])
      .json({ message: result.error });
  }

  return res.status(200).json({ count: result.data });
};
