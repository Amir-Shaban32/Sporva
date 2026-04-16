import { Request, Response, NextFunction } from "express";
import { catchAsync } from "../utils/catch-async";
import { BadRequestError } from "../errors/app-error";
import {
  createUserService,
  getUserByIdService,
  getUserByUsernameService,
  getUserByEmailService,
  getAllUsersService,
  updateUserService,
  deleteUserService,
  countUsersService,
} from "../services";

export const createUser = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;
  const user = await createUserService(data);
  return res.status(201).json({ user });
});

export const getUserById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    throw new BadRequestError("Bad request! ID is required");
  }

  const user = await getUserByIdService(id as string);
  return res.status(200).json({ user });
});

export const getUserByUsername = catchAsync(
  async (req: Request, res: Response) => {
    const { username } = req.query;
    if (!username) {
      throw new BadRequestError("Bad request! Username is required");
    }

    const user = await getUserByUsernameService(username as string);
    return res.status(200).json({ user });
  },
);

export const getUserByEmail = catchAsync(
  async (req: Request, res: Response) => {
    const { email } = req.query;
    if (!email) {
      throw new BadRequestError("Bad request! Email is required");
    }

    const user = await getUserByEmailService(email as string);
    return res.status(200).json({ user });
  },
);

export const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const page = req.query.page ? parseInt(req.query.page as string) : 1;
  const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

  const users = await getAllUsersService(page, limit);
  return res.status(200).json({ users });
});

export const updateUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;
  if (!id) throw new BadRequestError("Bad request! ID is required");

  const user = await updateUserService(id as string, data);
  return res.status(200).json({ user });
});

export const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    throw new BadRequestError("Bad request! ID is required");
  }

  await deleteUserService(id as string);
  return res.status(200).json({ message: "User deleted successfully" });
});

export const countUsers = catchAsync(async (_req: Request, res: Response) => {
  const count = await countUsersService();
  return res.status(200).json({ count });
});
