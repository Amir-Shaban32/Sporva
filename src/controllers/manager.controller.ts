import { Request, Response } from "express";
import { SERVICE_ERROR_STATUS } from "../config/http-status.config";
import {
  createManagerService,
  getManagerByNameService,
  getManagerByNationalityService,
  updateManagerService,
  countManagerService,
  deleteManagerService,
} from "../services/manager.service";

export const createManager = async (req: Request, res: Response) => {
  const data = req.body;
  if (!data.last_name || !data.birth_date || !data.nationality) {
    return res.status(400).json({
      message: "last_name, birth_date, and nationality are required!",
    });
  }

  const result = await createManagerService(data);

  if (!result.success) {
    return res
      .status(SERVICE_ERROR_STATUS[result.code ?? "DB_ERROR"])
      .json({ message: result.error });
  }

  return res.status(201).json({ manager: result.data });
};

export const findManagerByName = async (req: Request, res: Response) => {
  const { f_name, l_name } = req.query;
  if (!f_name && !l_name) {
    return res.status(400).json({ message: "Bad request!" });
  }

  const result = await getManagerByNameService({
    f_name: f_name as string,
    l_name: l_name as string,
  });

  if (!result.success) {
    return res
      .status(SERVICE_ERROR_STATUS[result.code ?? "DB_ERROR"])
      .json({ message: result.error });
  }

  return res.status(200).json({ managers: result.data });
};

export const findManagerByNationality = async (req: Request, res: Response) => {
  const { nationality } = req.query;
  if (!nationality) {
    return res.status(400).json({ message: "Bad request!" });
  }

  const result = await getManagerByNationalityService(nationality as string);

  if (!result.success) {
    return res
      .status(SERVICE_ERROR_STATUS[result.code ?? "DB_ERROR"])
      .json({ message: result.error });
  }

  return res.status(200).json({ managers: result.data });
};

export const updateManager = async (req: Request, res: Response) => {
  const { id } = req.query;
  const data = req.body;
  if (!id) return res.status(400).json({ message: "Bad request!" });

  const result = await updateManagerService(id as string, data);

  if (!result.success) {
    return res
      .status(SERVICE_ERROR_STATUS[result.code ?? "DB_ERROR"])
      .json({ message: result.error });
  }

  return res.status(200).json({ manager: result.data });
};

export const deleteManager = async (req: Request, res: Response) => {
  const { id } = req.query;
  if (!id) return res.status(400).json({ message: "Bad request!" });

  const result = await deleteManagerService(id as string);

  if (!result.success) {
    return res
      .status(SERVICE_ERROR_STATUS[result.code ?? "DB_ERROR"])
      .json({ message: result.error });
  }

  return res.status(200).json({ manager: result.data });
};

export const countManagers = async (req: Request, res: Response) => {
  const result = await countManagerService();

  if (!result.success) {
    return res
      .status(SERVICE_ERROR_STATUS[result.code ?? "DB_ERROR"])
      .json({ message: result.error });
  }

  return res.status(200).json({ count: result.data });
};
