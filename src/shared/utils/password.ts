import bcrypt from "bcrypt";

export const comparePassword = (plain: string, hash: string) =>
  bcrypt.compare(plain, hash);

export const hashPassword = (plain: string, salt: number = 10) =>
  bcrypt.hash(plain, salt);
