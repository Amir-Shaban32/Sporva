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
  return res.created("User created successfully", { user });
});

export const getUserById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    throw new BadRequestError("Bad request! ID is required");
  }

  const user = await getUserByIdService(id as string);
  return res.ok("User retrieved successfully", { user });
});

export const getUserByUsername = catchAsync(
  async (req: Request, res: Response) => {
    const { username } = req.query;
    if (!username) {
      throw new BadRequestError("Bad request! Username is required");
    }

    const user = await getUserByUsernameService(username as string);
    return res.ok("User retrieved successfully", { user });
  },
);

export const getUserByEmail = catchAsync(
  async (req: Request, res: Response) => {
    const { email } = req.query;
    if (!email) {
      throw new BadRequestError("Bad request! Email is required");
    }

    const user = await getUserByEmailService(email as string);
    return res.ok("User retrieved successfully", { user });
  },
);

export const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const page = req.query.page ? parseInt(req.query.page as string) : 1;
  const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

  const users = await getAllUsersService(page, limit);
  return res.ok("Users retrieved successfully", { users });
});

export const updateUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;
  if (!id) throw new BadRequestError("Bad request! ID is required");

  const user = await updateUserService(id as string, data);
  return res.ok("User updated successfully", { user });
});

export const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    throw new BadRequestError("Bad request! ID is required");
  }

  await deleteUserService(id as string);
  return res.ok("User deleted successfully");
});

export const countUsers = catchAsync(async (_req: Request, res: Response) => {
  const count = await countUsersService();
  return res.ok("User count retrieved successfully", { count });
});
