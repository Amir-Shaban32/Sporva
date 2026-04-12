import { Request, Response } from "express";
import { SERVICE_ERROR_STATUS } from "../config";
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

export const createUser = async (req: Request, res: Response) => {
  const data = req.body;

  const result = await createUserService(data);

  if (!result.success) {
    return res
      .status(SERVICE_ERROR_STATUS[result.code ?? "DB_ERROR"])
      .json({ message: result.error });
  }

  return res.status(201).json({ user: result.data });
};

export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "Bad request!" });
  }

  const result = await getUserByIdService(id as string);

  if (!result.success) {
    return res
      .status(SERVICE_ERROR_STATUS[result.code ?? "DB_ERROR"])
      .json({ message: result.error });
  }

  return res.status(200).json({ user: result.data });
};

export const getUserByUsername = async (req: Request, res: Response) => {
  const { username } = req.query;
  if (!username) {
    return res.status(400).json({ message: "Bad request!" });
  }

  const result = await getUserByUsernameService(username as string);

  if (!result.success) {
    return res
      .status(SERVICE_ERROR_STATUS[result.code ?? "DB_ERROR"])
      .json({ message: result.error });
  }

  return res.status(200).json({ user: result.data });
};

export const getUserByEmail = async (req: Request, res: Response) => {
  const { email } = req.query;
  if (!email) {
    return res.status(400).json({ message: "Bad request!" });
  }

  const result = await getUserByEmailService(email as string);

  if (!result.success) {
    return res
      .status(SERVICE_ERROR_STATUS[result.code ?? "DB_ERROR"])
      .json({ message: result.error });
  }

  return res.status(200).json({ user: result.data });
};

export const getAllUsers = async (req: Request, res: Response) => {
  const page = req.query.page ? parseInt(req.query.page as string) : 1;
  const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

  const result = await getAllUsersService(page, limit);

  if (!result.success) {
    return res
      .status(SERVICE_ERROR_STATUS[result.code ?? "DB_ERROR"])
      .json({ message: result.error });
  }

  return res.status(200).json({ users: result.data });
};

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;
  if (!id) return res.status(400).json({ message: "Bad request!" });

  const result = await updateUserService(id as string, data);

  if (!result.success) {
    return res
      .status(SERVICE_ERROR_STATUS[result.code ?? "DB_ERROR"])
      .json({ message: result.error });
  }

  return res.status(200).json({ user: result.data });
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "Bad request!" });
  }

  const result = await deleteUserService(id as string);

  if (!result.success) {
    return res
      .status(SERVICE_ERROR_STATUS[result.code ?? "DB_ERROR"])
      .json({ message: result.error });
  }

  return res.status(200).json({ message: "User deleted successfully" });
};

export const countUsers = async (req: Request, res: Response) => {
  const result = await countUsersService();

  if (!result.success) {
    return res
      .status(SERVICE_ERROR_STATUS[result.code ?? "DB_ERROR"])
      .json({ message: result.error });
  }

  return res.status(200).json({ count: result.data });
};
