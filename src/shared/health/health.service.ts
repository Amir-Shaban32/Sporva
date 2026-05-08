import { prisma } from "@shared/lib/prisma";

export const healthService = async () => {
  await prisma.$queryRaw`SELECT 1`;
  return {
    status: "ok",
    db: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  };
};
