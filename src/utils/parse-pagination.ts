import { Request } from "express";
import { PaginationQuery } from "src/validations/pagination.validation";

export const parsePagination = (req: Request) => {
  const { page, limit } = req.query as unknown as PaginationQuery;
  return { page, limit };
};
