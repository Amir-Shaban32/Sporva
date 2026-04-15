import { Request, Response } from "express";
import {
  loginService,
  logoutService,
  registerService,
  refreshTokenService,
} from "../../services";
import { SERVICE_ERROR_STATUS } from "../../config";
import { extractDeviceInfo } from "../../utils/device-info";

export const handleLogin = async (req: Request, res: Response) => {
  const incomingCookieToken = req.cookies?.token as string | undefined;

  if (incomingCookieToken) {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
  }

  const result = await loginService({
    username: req.body.username,
    password: req.body.password,
    deviceInfo: extractDeviceInfo(req),
    incomingCookieToken,
  });

  if (!result.success) {
    const status = SERVICE_ERROR_STATUS[result.code ?? "DB_ERROR"] ?? 500;
    return res.status(status).json({ status: "fail", message: result.error });
  }

  res.cookie("token", result.data.refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 24 * 60 * 60 * 1000,
  });

  return res.status(200).json({
    status: "success",
    accessToken: result.data.accessToken,
  });
};

export const handleLogout = async (req: Request, res: Response) => {
  const cookieToken = req.cookies?.token as string | undefined;

  const result = await logoutService({ cookieToken });

  if (!result.success) {
    const status = SERVICE_ERROR_STATUS[result.code ?? "DB_ERROR"] ?? 500;
    return res.status(status).json({ status: "fail", message: result.error });
  }

  res.clearCookie("token", { httpOnly: true, sameSite: "none", secure: true });
  return res.status(200).json({ message: `${result.data}` });
};

export const handleRegister = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  const result = await registerService({ username, email, password });

  if (!result.success) {
    const status = SERVICE_ERROR_STATUS[result.code ?? "DB_ERROR"] ?? 500;
    return res.status(status).json({ status: "fail", message: result.error });
  }

  return res.status(201).json({ status: "success", data: result.data });
};

export const handleRefreshToken = async (req: Request, res: Response) => {
  const incomingCookieToken = req.cookies?.token as string | undefined;

  res.clearCookie("token", { httpOnly: true, sameSite: "none", secure: true });

  const result = await refreshTokenService({
    cookieToken: incomingCookieToken,
    deviceInfo: extractDeviceInfo(req),
  });

  if (!result.success) {
    const status = SERVICE_ERROR_STATUS[result.code ?? "DB_ERROR"] ?? 500;
    return res.status(status).json({ status: "fail", message: result.error });
  }

  res.cookie("token", result.data.refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 24 * 60 * 60 * 1000,
  });

  return res.status(200).json({
    status: "success",
    accessToken: result.data.accessToken,
  });
};
