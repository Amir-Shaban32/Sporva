import { IUser } from "../types";
import { Request } from "express";
import { ForbiddenError } from "src/errors/app-error";

export const checkOwner = (user: IUser, req: Request) => {
  const userId = user.id;

  const isOwner = userId === req.user?.id;
  const isAdmin = req.user?.role === "ADMIN";

  if (!isOwner && !isAdmin) throw new ForbiddenError("Access denied");
};
