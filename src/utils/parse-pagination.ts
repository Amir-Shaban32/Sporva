import { Request } from "express";
import { PaginationQuery } from "src/validations/pagination.validation";

export interface ParsedPagination {
  page: number;
  limit: number;
}
export const parsePagination = (req: Request): ParsedPagination => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  return { page, limit };
};
