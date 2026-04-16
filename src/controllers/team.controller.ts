import { Request, Response } from "express";
import { catchAsync } from "../utils/catch-async";
import { BadRequestError } from "../errors/app-error";
import {
  createTeamService,
  getTeamByIdService,
  getTeamByNameService,
  getRefereeByCityService,
  updateTeamService,
  countTeamService,
  deleteTeamService,
} from "../services";

export const createTeam = catchAsync(async (req: Request, res: Response) => {
  const team = await createTeamService(req.body);
  return res.status(201).json({ team });
});

export const getTeamById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    throw new BadRequestError("Bad request! ID is required");
  }

  const team = await getTeamByIdService(id as string);
  return res.status(200).json({ team });
});

export const getTeamByName = catchAsync(async (req: Request, res: Response) => {
  const { name } = req.query;
  if (!name) {
    throw new BadRequestError("Bad request! Name is required");
  }

  const teams = await getTeamByNameService(name as string);
  return res.status(200).json({ teams });
});

export const getTeamByCity = catchAsync(async (req: Request, res: Response) => {
  const { city } = req.query;
  if (!city) {
    throw new BadRequestError("Bad request! City is required");
  }

  const teams = await getRefereeByCityService(city as string);
  return res.status(200).json({ teams });
});

export const updateTeam = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) throw new BadRequestError("Bad request! ID is required");

  const team = await updateTeamService(id as string, req.body);
  return res.status(200).json({ team });
});

export const deleteTeam = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) throw new BadRequestError("Bad request! ID is required");

  await deleteTeamService(id as string);
  return res.status(200).json({ message: "Team deleted successfully" });
});

export const countTeams = catchAsync(async (_req: Request, res: Response) => {
  const count = await countTeamService();
  return res.status(200).json({ count });
});
