import { Request, Response, NextFunction } from "express";
import { createId } from "@paralleldrive/cuid2";

export const requestId = (req: Request, res: Response, next: NextFunction) => {
  const id =
    ((req.headers["x-request-id"] as string) || undefined) ?? createId();
  req.id = id;
  res.setHeader("x-request-id", id);
  next();
};
