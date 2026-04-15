import { Request, Response } from "express";
import { SERVICE_ERROR_STATUS } from "../config";
import {
  createManagerContractService,
  getActiveManagerContractsService,
  getExpiredManagerContractsService,
  getManagerContractsByManagerService,
  deActivateManagerContractService,
  getManagerContractsByIntervalService,
} from "../services";

export const createManagerContract = async (req: Request, res: Response) => {
  const data = req.body;

  const result = await createManagerContractService(data);

  if (!result.success) {
    return res
      .status(SERVICE_ERROR_STATUS[result.code ?? "DB_ERROR"])
      .json({ message: result.error });
  }

  return res.status(201).json({ contract: result.data });
};

export const getActiveManagerContracts = async (
  req: Request,
  res: Response,
) => {
  const result = await getActiveManagerContractsService();

  if (!result.success) {
    return res
      .status(SERVICE_ERROR_STATUS[result.code ?? "DB_ERROR"])
      .json({ message: result.error });
  }

  return res.status(200).json({ contracts: result.data });
};

export const getExpiredManagerContracts = async (
  req: Request,
  res: Response,
) => {
  const result = await getExpiredManagerContractsService();

  if (!result.success) {
    return res
      .status(SERVICE_ERROR_STATUS[result.code ?? "DB_ERROR"])
      .json({ message: result.error });
  }

  return res.status(200).json({ contracts: result.data });
};

export const getManagerContractsByManager = async (
  req: Request,
  res: Response,
) => {
  const { manager_id } = req.params;
  if (!manager_id) {
    return res.status(400).json({ message: "Bad request!" });
  }

  const result = await getManagerContractsByManagerService(
    manager_id as string,
  );

  if (!result.success) {
    return res
      .status(SERVICE_ERROR_STATUS[result.code ?? "DB_ERROR"])
      .json({ message: result.error });
  }

  return res.status(200).json({ contracts: result.data });
};

export const deActivateManagerContract = async (
  req: Request,
  res: Response,
) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "Bad request!" });
  }

  const result = await deActivateManagerContractService(id as string);

  if (!result.success) {
    return res
      .status(SERVICE_ERROR_STATUS[result.code ?? "DB_ERROR"])
      .json({ message: result.error });
  }

  return res.status(200).json({ message: "Contract deactivated successfully" });
};

export const getManagerContractsByInterval = async (
  req: Request,
  res: Response,
) => {
  const { period } = req.query;
  if (!period) {
    return res.status(400).json({ message: "Bad request!" });
  }

  const result = await getManagerContractsByIntervalService(
    parseInt(period as string),
  );

  if (!result.success) {
    return res
      .status(SERVICE_ERROR_STATUS[result.code ?? "DB_ERROR"])
      .json({ message: result.error });
  }

  return res.status(200).json({ contracts: result.data });
};
