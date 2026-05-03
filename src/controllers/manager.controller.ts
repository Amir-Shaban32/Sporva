import { Request, Response } from "express";
import { catchAsync } from "../utils/catch-async";
import { BadRequestError } from "../errors/app-error";
import {
  createManagerService,
  getManagerByIdService,
  getManagerByNameService,
  getManagerByNationalityService,
  updateManagerService,
  countManagerService,
  deleteManagerService,
  getAllManagersService,
} from "../services";
import { parsePagination } from "../utils/parse-pagination";

export const createManager = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;
  const manager = await createManagerService(data);
  return res.created("Manager created successfully", { manager });
});

export const getAllManagers = catchAsync(
  async (req: Request, res: Response) => {
    const { page, limit } = parsePagination(req);

    const result = await getAllManagersService(page, limit);
    if (!result) return res.noContent();

    const { managers, total } = result;

    return res.paginated(
      managers,
      total,
      page,
      limit,
      "Managers retrieved successfully",
    );
  },
);

export const getManagerById = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) throw new BadRequestError("Bad request! ID is required");

    const manager = await getManagerByIdService(id as string);
    return res.ok("Manager retrieved successfully", { manager });
  },
);

export const getManagerByName = catchAsync(
  async (req: Request, res: Response) => {
    const { f_name, l_name } = req.query;
    if (!f_name && !l_name) {
      throw new BadRequestError("Bad request! First or last name is required");
    }

    const managers = await getManagerByNameService({
      f_name: f_name as string,
      l_name: l_name as string,
    });
    if (!managers) return res.noContent();

    return res.ok("Managers retrieved successfully", { managers });
  },
);

export const getManagerByNationality = catchAsync(
  async (req: Request, res: Response) => {
    const { nationality } = req.query;
    if (!nationality) {
      throw new BadRequestError("Bad request! Nationality is required");
    }

    const managers = await getManagerByNationalityService(
      nationality as string,
    );
    if (!managers) return res.noContent();

    return res.ok("Managers retrieved successfully", { managers });
  },
);

export const updateManager = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;
  if (!id) throw new BadRequestError("Bad request! ID is required");

  const manager = await updateManagerService(id as string, data);
  return res.ok("Manager updated successfully", { manager });
});

export const deleteManager = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) throw new BadRequestError("Bad request! ID is required");

  const manager = await deleteManagerService(id as string);
  return res.ok("Manager deleted successfully", { manager });
});

export const countManagers = catchAsync(
  async (_req: Request, res: Response) => {
    const count = await countManagerService();
    return res.ok("Manager count retrieved successfully", { count });
  },
);
