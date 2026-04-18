import { Request, Response } from "express";
import { catchAsync } from "../utils/catch-async";
import { BadRequestError } from "../errors/app-error";
import {
  getPlayerByNameService,
  getPlayerByTeamService,
  getPlayerByPositionService,
  getPlayerByNationalityService,
  updatePlayerService,
  deletePlayerService,
  countPlayerService,
  createPlayerService,
} from "../services";
import { Positions } from "../../generated/prisma";

export const createPlayer = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;

  const player = await createPlayerService(data);

  return res.created("Player created successfully", { player });
});

export const getPlayerByName = catchAsync(
  async (req: Request, res: Response) => {
    const { f_name, l_name } = req.query;
    if (!f_name && !l_name) {
      throw new BadRequestError("Bad request! First or last name is required");
    }

    const players = await getPlayerByNameService({
      f_name: f_name as string,
      l_name: l_name as string,
    });

    return res.ok("Players retrieved successfully", { players });
  },
);

export const getPlayerByTeam = catchAsync(
  async (req: Request, res: Response) => {
    const { team_id } = req.params;
    if (!team_id) {
      throw new BadRequestError("Bad request! Team ID is required");
    }

    const players = await getPlayerByTeamService(team_id as string);

    return res.ok("Players retrieved successfully", { players });
  },
);

export const getPlayerByPosition = catchAsync(
  async (req: Request, res: Response) => {
    const { position } = req.query;
    if (!position) {
      throw new BadRequestError("Bad request! Position is required");
    }

    const players = await getPlayerByPositionService(position as Positions);

    return res.ok("Players retrieved successfully", { players });
  },
);

export const getPlayerByNationality = catchAsync(
  async (req: Request, res: Response) => {
    const { nationality } = req.query;
    if (!nationality) {
      throw new BadRequestError("Bad request! Nationality is required");
    }

    const players = await getPlayerByNationalityService(nationality as string);

    return res.ok("Players retrieved successfully", { players });
  },
);

export const updatePlayer = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;
  if (!id) throw new BadRequestError("Bad request! ID is required");

  const player = await updatePlayerService(id as string, data);

  return res.ok("Player updated successfully", { player });
});

export const deletePlayer = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) throw new BadRequestError("Bad request! ID is required");

  await deletePlayerService(id as string);

  return res.ok("Player deleted successfully");
});

export const countPlayers = catchAsync(async (_req: Request, res: Response) => {
  const count = await countPlayerService();

  return res.ok("Player count retrieved successfully", { count });
});
