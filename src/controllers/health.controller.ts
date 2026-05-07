import { Request, Response } from "express";
import { healthService } from "../services/health.service";
import { StatusCodes } from "http-status-codes";

export const health = async (_req: Request, res: Response) => {
  try {
    const result = await healthService();
    return res.status(StatusCodes.OK).json(result);
  } catch {
    return res.status(StatusCodes.SERVICE_UNAVAILABLE).json({
      status: "error",
      db: "unreachable",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  }
};
