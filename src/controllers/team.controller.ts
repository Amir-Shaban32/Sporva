import { Request, Response } from "express";
import { catchAsync } from "../utils/catch-async";
import { BadRequestError } from "../errors/app-error";
import {
  createTeamService,
  getTeamByIdService,
  getTeamByNameService,
  getTeamByCityService,
  updateTeamService,
  countTeamService,
  deleteTeamService,
  getAllTeamsService,
} from "../services";
import { parsePagination } from "../utils/parse-pagination";

export const createTeam = catchAsync(async (req: Request, res: Response) => {
  const team = await createTeamService(req.body);
  return res.created("Team created successfully", { team });
});

export const getAllTeams = catchAsync(async (req: Request, res: Response) => {
  const { page, limit } = parsePagination(req);

  const result = await getAllTeamsService(page, limit);
  if (!result) return res.noContent();

  const { teams, total } = result;

  return res.paginated(
    teams,
    total,
    page,
    limit,
    "Teams retrieved successfully",
  );
});

export const getTeamById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    throw new BadRequestError("Bad request! ID is required");
  }

  const team = await getTeamByIdService(id as string);
  return res.ok("Team retrieved successfully", { team });
});

export const getTeamByName = catchAsync(async (req: Request, res: Response) => {
  const { name } = req.query;
  if (!name) {
    throw new BadRequestError("Bad request! Name is required");
  }

  const teams = await getTeamByNameService(name as string);
  return res.ok("Teams retrieved successfully", { teams });
});

export const getTeamByCity = catchAsync(async (req: Request, res: Response) => {
  const { city } = req.query;
  if (!city) {
    throw new BadRequestError("Bad request! City is required");
  }

  const teams = await getTeamByCityService(city as string);
  if (!teams) return res.noContent();
  return res.ok("Teams retrieved successfully", { teams });
});

export const updateTeam = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) throw new BadRequestError("Bad request! ID is required");

  const team = await updateTeamService(id as string, req.body);
  return res.ok("Team updated successfully", { team });
});

export const deleteTeam = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) throw new BadRequestError("Bad request! ID is required");

  await deleteTeamService(id as string);
  return res.ok("Team deleted successfully");
});

export const countTeams = catchAsync(async (_req: Request, res: Response) => {
  const count = await countTeamService();
  return res.ok("Team count retrieved successfully", { count });
});
