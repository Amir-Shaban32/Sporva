import { Request, Response } from "express";
import { SERVICE_ERROR_STATUS } from "../config/http-status.config";
import {
  createPlayerContractService,
  getActivePlayerContractsService,
  getExpiredPlayerContractsService,
  getPlayerContractsByPlayerService,
  deActivatePlayerContractService,
  getPlayerContractsByIntervalService,
} from "../services/player_contract.service";

export const createPlayerContract = async (req: Request, res: Response) => {
  const data = req.body;
  if (
    !data.player_id ||
    !data.team_id ||
    !data.start_date ||
    !data.end_date ||
    !data.salary
  ) {
    return res.status(400).json({
      message: "Missing required fields for contract!",
    });
  }

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
  const { player_id } = req.query;
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
  const { id } = req.query;
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
