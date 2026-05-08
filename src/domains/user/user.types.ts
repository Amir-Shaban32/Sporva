import { User_Role } from "@generated/prisma";

export interface ICreateUser {
  username: string;
  email: string;
  password: string;
  role?: User_Role;
}

export interface IUser {
  id: string;
  username: string;
  email: string;
  role: User_Role;
  created_at: Date;
  updated_at: Date;
}
