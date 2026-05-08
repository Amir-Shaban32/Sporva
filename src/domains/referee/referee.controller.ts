import { Request, Response } from "express";
import { catchAsync } from "@shared/utils/catch-async";
import { BadRequestError } from "@shared/errors/app-error";
import {
  createRefereeService,
  getRefereeByIdService,
  getRefereeByNameService,
  getRefereeByNationalityService,
  updateRefereeService,
  countRefereeService,
  deleteRefereeService,
  getAllRefereesService,
} from "./referee.service";
import { getRefereesByMatchService } from "@domains/match-referee/match-referee.service";
import { parsePagination } from "@shared/utils/parse-pagination";

export const createReferee = catchAsync(async (req: Request, res: Response) => {
  const referee = await createRefereeService(req.body);
  return res.created("Referee created successfully", { referee });
});

export const getAllReferees = catchAsync(
  async (req: Request, res: Response) => {
    const { page, limit } = parsePagination(req);

    const result = await getAllRefereesService(page, limit);
    if (!result) return res.noContent();

    const { referees, total } = result;

    return res.paginated(
      referees,
      total,
      page,
      limit,
      "Referees retrieved successfully",
    );
  },
);

export const getRefereeById = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
      throw new BadRequestError("Bad request! ID is required");
    }

    const referee = await getRefereeByIdService(id as string);
    return res.ok("Referee retrieved successfully", { referee });
  },
);

export const getRefereeByName = catchAsync(
  async (req: Request, res: Response) => {
    const { f_name, l_name } = req.query;
    if (!f_name && !l_name) {
      throw new BadRequestError("Bad request! First or last name is required");
    }

    const referees = await getRefereeByNameService({
      f_name: f_name as string,
      l_name: l_name as string,
    });
    if (!referees) return res.noContent();

    return res.ok("Referees retrieved successfully", { referees });
  },
);

export const getRefereeByNationality = catchAsync(
  async (req: Request, res: Response) => {
    const { nationality } = req.query;
    if (!nationality) {
      throw new BadRequestError("Bad request! Nationality is required");
    }

    const referees = await getRefereeByNationalityService(
      nationality as string,
    );
    if (!referees) return res.noContent();

    return res.ok("Referees retrieved successfully", { referees });
  },
);

export const getRefereesByMatch = catchAsync(
  async (req: Request, res: Response) => {
    const { match_id } = req.params;
    if (!match_id) {
      throw new BadRequestError("Bad request! Match ID is required");
    }

    const referees = await getRefereesByMatchService(match_id as string);
    if (!referees) return res.noContent();

    return res.ok("Referees retrieved successfully", { referees });
  },
);

export const updateReferee = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) throw new BadRequestError("Bad request! ID is required");

  const referee = await updateRefereeService(id as string, req.body);
  return res.ok("Referee updated successfully", { referee });
});

export const deleteReferee = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) throw new BadRequestError("Bad request! ID is required");

  await deleteRefereeService(id as string);
  return res.ok("Referee deleted successfully");
});

export const countReferees = catchAsync(async (req: Request, res: Response) => {
  const count = await countRefereeService();
  return res.ok("Referee count retrieved successfully", { count });
});
