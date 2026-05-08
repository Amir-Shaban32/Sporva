import { Request } from "express";

export const parsePeriod = (req: Request): number => {
  const period = req.query.period as string;
  const value = parseInt(period.slice(0, -1), 10);
  const unit = period.slice(-1);

  switch (unit) {
    case "y":
      return value * 365;
    case "m":
      return value * 30;
    case "d":
      return value;
    default:
      throw new Error("Invalid period unit");
  }
};
