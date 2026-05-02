import "./config/env.config";
import app from "./app";
import { logger } from "./config";
import { env } from "./config";
import { prisma } from "./lib/prisma";
const startServer = async () => {
  try {
    prisma.$connect();
    logger.info("Database connected successfully");

    app.listen(env.PORT, () =>
      logger.info(`server is running on http://localhost:${env.PORT}/`),
    );
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error(String(error));
    logger.error(err);
    process.exit(1);
  }
};

startServer();
