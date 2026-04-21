import { Request, Response } from "express";
import { catchAsync } from "../../utils/catch-async";
import {
  loginService,
  logoutService,
  registerService,
  refreshTokenService,
} from "../../services";
import { extractDeviceInfo } from "../../utils/device-info";

const isProd = process.env.NODE_ENV === "production";
const cookieOptions = {
  httpOnly: true,
  sameSite: isProd ? ("none" as const) : ("lax" as const),
  secure: isProd,
  maxAge: 24 * 60 * 60 * 1000,
};

export const handleLogin = catchAsync(async (req: Request, res: Response) => {
  const incomingCookieToken = req.cookies?.token as string | undefined;

  if (incomingCookieToken) {
    res.clearCookie("token", cookieOptions);
  }

  const result = await loginService({
    username: req.body.username,
    password: req.body.password,
    deviceInfo: extractDeviceInfo(req),
    incomingCookieToken,
  });

  res.cookie("token", result.refreshToken, cookieOptions);

  return res.ok("Login successful", { accessToken: result.accessToken });
});

export const handleLogout = catchAsync(async (req: Request, res: Response) => {
  const cookieToken = req.cookies?.token as string | undefined;

  const message = await logoutService({ cookieToken });

  res.clearCookie("token", cookieOptions);
  return res.ok("Logout successful", { message });
});

export const handleRegister = catchAsync(
  async (req: Request, res: Response) => {
    const { username, email, password } = req.body;

    const user = await registerService({ username, email, password });

    return res.created("User registered successfully", { data: user });
  },
);

export const handleRefreshToken = catchAsync(
  async (req: Request, res: Response) => {
    const incomingCookieToken = req.cookies?.token as string | undefined;

    res.clearCookie("token", cookieOptions);

    const result = await refreshTokenService({
      cookieToken: incomingCookieToken,
      deviceInfo: extractDeviceInfo(req),
    });

    res.cookie("token", result.refreshToken, cookieOptions);

    return res.ok("Token refreshed successfully", {
      accessToken: result.accessToken,
    });
  },
);
