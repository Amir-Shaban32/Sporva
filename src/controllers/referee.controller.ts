import { Request, Response } from "express";
import { SERVICE_ERROR_STATUS } from "../config/http-status.config";
import {
  createRefereeService,
  getRefereeByIdService,
  getRefereeByNameService,
  getRefereeByNationalityService,
  updateRefereeService,
  countRefereeService,
  deleteRefereeService,
} from "../services/referee.service";

export const createReferee = async (req: Request, res: Response) => {
  const data = req.body;
  if (!data.last_name || !data.birth_date || !data.nationality) {
    return res.status(400).json({
      message: "last_name, birth_date, and nationality are required!",
    });
  }

  const result = await createRefereeService(data);

  if (!result.success) {
    return res
      .status(SERVICE_ERROR_STATUS[result.code ?? "DB_ERROR"])
      .json({ message: result.error });
  }

  return res.status(201).json({ referee: result.data });
};

export const getRefereeById = async (req: Request, res: Response) => {
  const { id } = req.query;
  if (!id) {
    return res.status(400).json({ message: "Bad request!" });
  }

  const result = await getRefereeByIdService(id as string);

  if (!result.success) {
    return res
      .status(SERVICE_ERROR_STATUS[result.code ?? "DB_ERROR"])
      .json({ message: result.error });
  }

  return res.status(200).json({ referee: result.data });
};

export const findRefereeByName = async (req: Request, res: Response) => {
  const { f_name, l_name } = req.query;
  if (!f_name && !l_name) {
    return res.status(400).json({ message: "Bad request!" });
  }

  const result = await getRefereeByNameService({
    f_name: f_name as string,
    l_name: l_name as string,
  });

  if (!result.success) {
    return res
      .status(SERVICE_ERROR_STATUS[result.code ?? "DB_ERROR"])
      .json({ message: result.error });
  }

  return res.status(200).json({ referees: result.data });
};

export const findRefereeByNationality = async (req: Request, res: Response) => {
  const { nationality } = req.query;
  if (!nationality) {
    return res.status(400).json({ message: "Bad request!" });
  }

  const result = await getRefereeByNationalityService(nationality as string);

  if (!result.success) {
    return res
      .status(SERVICE_ERROR_STATUS[result.code ?? "DB_ERROR"])
      .json({ message: result.error });
  }

  return res.status(200).json({ referees: result.data });
};

export const updateReferee = async (req: Request, res: Response) => {
  const { id } = req.query;
  const data = req.body;
  if (!id) return res.status(400).json({ message: "Bad request!" });

  const result = await updateRefereeService(id as string, data);

  if (!result.success) {
    return res
      .status(SERVICE_ERROR_STATUS[result.code ?? "DB_ERROR"])
      .json({ message: result.error });
  }

  return res.status(200).json({ referee: result.data });
};

export const deleteReferee = async (req: Request, res: Response) => {
  const { id } = req.query;
  if (!id) return res.status(400).json({ message: "Bad request!" });

  const result = await deleteRefereeService(id as string);

  if (!result.success) {
    return res
      .status(SERVICE_ERROR_STATUS[result.code ?? "DB_ERROR"])
      .json({ message: result.error });
  }

  return res.status(200).json({ referee: result.data });
};

export const countReferees = async (req: Request, res: Response) => {
  const result = await countRefereeService();

  if (!result.success) {
    return res
      .status(SERVICE_ERROR_STATUS[result.code ?? "DB_ERROR"])
      .json({ message: result.error });
  }

  return res.status(200).json({ count: result.data });
};
