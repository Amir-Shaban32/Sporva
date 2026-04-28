import { Request, Response } from "express";
import { catchAsync } from "../utils/catch-async";
import { BadRequestError } from "../errors/app-error";
import {
  createMatchEventService,
  getMatchEventsByMatchService,
  getMatchEventsByTypeService,
  getMatchEventsByPlayerService,
  deleteMatchEventService,
} from "../services";
import { Event_types } from "../../generated/prisma";

export const createMatchEvent = catchAsync(
  async (req: Request, res: Response) => {
    const event = await createMatchEventService(req.body);
    return res.created("Match event created successfully", { event });
  },
);

export const getMatchEventsByMatch = catchAsync(
  async (req: Request, res: Response) => {
    const { matchId } = req.params;
    if (!matchId) {
      throw new BadRequestError("Bad request! Match ID is required");
    }
    const events = await getMatchEventsByMatchService(matchId as string);
    return res.ok("Match events retrieved successfully", { events });
  },
);

export const getMatchEventsByType = catchAsync(
  async (req: Request, res: Response) => {
    const { eventType } = req.query;
    if (!eventType) {
      throw new BadRequestError("Bad request! Event type is required");
    }

    const events = await getMatchEventsByTypeService(eventType as Event_types);
    return res.ok("Match events retrieved successfully", { events });
  },
);

export const getMatchEventsByPlayer = catchAsync(
  async (req: Request, res: Response) => {
    const { playerId } = req.params;
    if (!playerId) {
      throw new BadRequestError("Bad request! Player ID is required");
    }

    const events = await getMatchEventsByPlayerService(playerId as string);
    return res.ok("Match events retrieved successfully", { events });
  },
);

export const deleteMatchEvent = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
      throw new BadRequestError("Bad request! ID is required");
    }

    await deleteMatchEventService(id as string);
    return res.ok("Match event deleted successfully");
  },
);
