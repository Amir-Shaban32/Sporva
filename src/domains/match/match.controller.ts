import { Request, Response } from "express";
import { catchAsync } from "@shared/utils/catch-async";
import { BadRequestError } from "@shared/errors/app-error";
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
  recordMatchResultService,
  getMatchByIdService,
  updateMatchStatusService,
} from "./match.service";
import { Match_status, Competitions } from "@generated/prisma";

export const scheduleMatch = catchAsync(async (req: Request, res: Response) => {
  const match = await scheduleMatchService(req.body);
  return res.created("Match scheduled successfully", { match });
});

export const getMatchByTeam = catchAsync(
  async (req: Request, res: Response) => {
    const { teamId } = req.params;
    if (!teamId) {
      throw new BadRequestError("Bad request! Team ID is required");
    }

    const matches = await getMatchByTeamService(teamId as string);
    if (!matches) return res.noContent();

    return res.ok("Matches retrieved successfully", { matches });
  },
);

export const getMatchById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) throw new BadRequestError("id is missing");
  const match = await getMatchByIdService(id as string);
  return res.ok("Match retrieved successfully", { match });
});

export const getLiveMatches = catchAsync(
  async (_req: Request, res: Response) => {
    const matches = await getLiveMatchesService();
    if (!matches) return res.noContent();

    return res.ok("Live matches retrieved successfully", { matches });
  },
);

export const getMatchesByStatus = catchAsync(
  async (req: Request, res: Response) => {
    const { status } = req.query;
    if (!status) {
      throw new BadRequestError("Bad request! Status is required");
    }

    const matches = await getMatchesByStatusService(status as Match_status);
    if (!matches) return res.noContent();

    return res.ok("Matches retrieved successfully", { matches });
  },
);

export const getMatchesByCompetition = catchAsync(
  async (req: Request, res: Response) => {
    const { competition } = req.query;
    if (!competition) {
      throw new BadRequestError("Bad request! Competition is required");
    }

    const matches = await getMatchesByCompetitionService(
      competition as Competitions,
    );
    if (!matches) return res.noContent();

    return res.ok("Matches retrieved successfully", { matches });
  },
);

export const getMatchesBySeasonEndpoint = catchAsync(
  async (req: Request, res: Response) => {
    const { season } = req.query;
    if (!season) {
      throw new BadRequestError("Bad request! Season is required");
    }

    const matches = await getMatchesBySeason(season as string);
    if (!matches) return res.noContent();

    return res.ok("Matches retrieved successfully", { matches });
  },
);

export const getMatchesByDate = catchAsync(
  async (req: Request, res: Response) => {
    const { date } = req.query;
    if (!date) {
      throw new BadRequestError("Bad request! Date is required");
    }

    const matches = await getMatchesByDateService(new Date(date as string));
    if (!matches) return res.noContent();

    return res.ok("Matches retrieved successfully", { matches });
  },
);

export const getMatchesByRound = catchAsync(
  async (req: Request, res: Response) => {
    const { round } = req.query;
    if (!round) {
      throw new BadRequestError("Bad request! Round is required");
    }

    const matches = await getMatchesByRoundService(parseInt(round as string));
    if (!matches) return res.noContent();

    return res.ok("Matches retrieved successfully", { matches });
  },
);

export const getMatchesWithExtraTime = catchAsync(
  async (_req: Request, res: Response) => {
    const matches = await getMatchesWithExtraTimeService();
    if (!matches) return res.noContent();

    return res.ok("Matches with extra time retrieved successfully", {
      matches,
    });
  },
);

export const getMatchesWithPenalties = catchAsync(
  async (_req: Request, res: Response) => {
    const matches = await getMatchesWithPenaltiesService();
    if (!matches) return res.noContent();

    return res.ok("Matches with penalties retrieved successfully", { matches });
  },
);

export const updateMatch = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) throw new BadRequestError("Bad request! ID is required");

  const match = await updateMatchService(id as string, req.body);
  return res.ok("Match updated successfully", { match });
});

export const updateMatchStatus = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;

    await updateMatchStatusService(id as string, status as Match_status);
    return res.ok("Status updated successfully and reflected to league table");
  },
);

export const recordMatchResult = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) throw new BadRequestError("Bad request! ID is required");

    await recordMatchResultService(id as string);
    return res.ok("Match result recorded successfully");
  },
);
