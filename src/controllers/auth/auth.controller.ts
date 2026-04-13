import { Request, Response } from "express";
import { loginService } from "../../services/auth/login.service";
import { SERVICE_ERROR_STATUS } from "../../config";
import { extractDeviceInfo } from "../../utils/deviceInfo";

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
