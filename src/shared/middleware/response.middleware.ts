import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../response/api-response";
import { StatusCodes, ReasonPhrases } from "http-status-codes";
import { PaginationMeta } from "@shared/types/express/express";

export const responseMiddleware = (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  res.ok = <T>(message: string = ReasonPhrases.OK, data?: T) =>
    res.status(StatusCodes.OK).json(ApiResponse.formatSuccess(data, message));

  res.created = <T>(message: string = ReasonPhrases.CREATED, data?: T) =>
    res
      .status(StatusCodes.CREATED)
      .json(ApiResponse.formatSuccess(data, message));

  res.noContent = <T>() => res.status(StatusCodes.NO_CONTENT).send();

  res.paginated = <T>(
    items: T[],
    total: number,
    page: number,
    limit: number,
    message: string,
  ) => {
    const meta: PaginationMeta = {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasPrevious: page > 1,
      hasNext: page < Math.ceil(total / limit),
    };
    return res
      .status(StatusCodes.OK)
      .json(ApiResponse.formatSuccess(items, message, meta));
  };

  next();
};
