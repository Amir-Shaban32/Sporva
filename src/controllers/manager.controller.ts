import { Request, Response } from "express";
import { catchAsync } from "../utils/catch-async";
import { BadRequestError } from "../errors/app-error";
import {
  createManagerService,
  getManagerByNameService,
  getManagerByNationalityService,
  updateManagerService,
  countManagerService,
  deleteManagerService,
} from "../services";

export const createManager = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;
  const manager = await createManagerService(data);
  return res.status(201).json({ manager });
});

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

    return res.status(200).json({ managers });
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
    return res.status(200).json({ managers });
  },
);

export const updateManager = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;
  if (!id) throw new BadRequestError("Bad request! ID is required");

  const manager = await updateManagerService(id as string, data);
  return res.status(200).json({ manager });
});

export const deleteManager = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) throw new BadRequestError("Bad request! ID is required");

  const manager = await deleteManagerService(id as string);
  return res.status(200).json({ manager });
});

export const countManagers = catchAsync(
  async (_req: Request, res: Response) => {
    const count = await countManagerService();
    return res.status(200).json({ count });
  },
);
