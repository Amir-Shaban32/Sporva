import { Request, Response } from "express";
import { SERVICE_ERROR_STATUS } from "../config";
import {
  createPlayerContractService,
  getActivePlayerContractsService,
  getExpiredPlayerContractsService,
  getPlayerContractsByPlayerService,
  deActivatePlayerContractService,
  getPlayerContractsByIntervalService,
} from "../services";

export const createPlayerContract = async (req: Request, res: Response) => {
  const data = req.body;

  const result = await createPlayerContractService(data);

  if (!result.success) {
    return res
      .status(SERVICE_ERROR_STATUS[result.code ?? "DB_ERROR"])
      .json({ message: result.error });
  }

  return res.status(201).json({ contract: result.data });
};

export const getActivePlayerContracts = async (req: Request, res: Response) => {
  const result = await getActivePlayerContractsService();

  if (!result.success) {
    return res
      .status(SERVICE_ERROR_STATUS[result.code ?? "DB_ERROR"])
      .json({ message: result.error });
  }

  return res.status(200).json({ contracts: result.data });
};

export const getExpiredPlayerContracts = async (
  req: Request,
  res: Response,
) => {
  const result = await getExpiredPlayerContractsService();

  if (!result.success) {
    return res
      .status(SERVICE_ERROR_STATUS[result.code ?? "DB_ERROR"])
      .json({ message: result.error });
  }

  return res.status(200).json({ contracts: result.data });
};

export const getPlayerContractsByPlayer = async (
  req: Request,
  res: Response,
) => {
  const { player_id } = req.params;
  if (!player_id) {
    return res.status(400).json({ message: "Bad request!" });
  }

  const result = await getPlayerContractsByPlayerService(player_id as string);

  if (!result.success) {
    return res
      .status(SERVICE_ERROR_STATUS[result.code ?? "DB_ERROR"])
      .json({ message: result.error });
  }

  return res.status(200).json({ contracts: result.data });
};

export const deActivatePlayerContract = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "Bad request!" });
  }

  const result = await deActivatePlayerContractService(id as string);

  if (!result.success) {
    return res
      .status(SERVICE_ERROR_STATUS[result.code ?? "DB_ERROR"])
      .json({ message: result.error });
  }

  return res.status(200).json({ message: "Contract deactivated successfully" });
};

export const getPlayerContractsByInterval = async (
  req: Request,
  res: Response,
) => {
  const { period } = req.query;
  if (!period) {
    return res.status(400).json({ message: "Bad request!" });
  }

  const result = await getPlayerContractsByIntervalService(
    parseInt(period as string),
  );

  if (!result.success) {
    return res
      .status(SERVICE_ERROR_STATUS[result.code ?? "DB_ERROR"])
      .json({ message: result.error });
  }

  return res.status(200).json({ contracts: result.data });
};
