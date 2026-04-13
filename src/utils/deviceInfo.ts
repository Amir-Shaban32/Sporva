import { Request } from "express";
import { DeviceInfo } from "../types/auth.type";

export const extractDeviceInfo = (req: Request): DeviceInfo => {
  const ua = req.headers["user-agent"] ?? "unknown";
  const ip =
    (req.headers["x-forwarded-for"] as string)?.split(",")[0].trim() ??
    req.socket.remoteAddress ??
    "unknown";

  const isAndroid = /android/i.test(ua);
  const isIos = /iphone|ipad|ipod/i.test(ua);
  const isMobile = isAndroid || isIos;

  return {
    ip,
    userAgent: ua,
    device: isAndroid ? "mobile" : "desktop",
    os: isAndroid
      ? "Android"
      : isIos
        ? "iOS"
        : /windows/i.test(ua)
          ? "Windows"
          : /mac/i.test(ua)
            ? "MacOs"
            : /linux/i.test(ua)
              ? "Linux"
              : "unknown",
    browser:
      /chrome/i.test(ua) && !/edg/i.test(ua)
        ? "Chrome"
        : /firefox/i.test(ua)
          ? "Firefox"
          : /safari/i.test(ua) && !/chrome/i.test(ua)
            ? "Safari"
            : /edg/i.test(ua)
              ? "Edge"
              : "unknown",
  };
};
