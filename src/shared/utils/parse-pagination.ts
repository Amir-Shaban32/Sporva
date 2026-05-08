import { Request } from "express";

export interface ParsedPagination {
  page: number;
  limit: number;
}
export const parsePagination = (req: Request): ParsedPagination => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  return { page, limit };
};
