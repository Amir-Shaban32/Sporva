import "@shared/config/env.config";
import app from "./app";
import { logger, env } from "@shared/config";
import { prisma } from "@shared/lib/prisma";

const SHUTDOWN_TIMEOUT_MS = 10_000;

function gracefulShutdown(
  signal: string,
  server: ReturnType<typeof app.listen>,
) {
  logger.info(`Received ${signal}, starting graceful shutdown...`);

  const forceExit = setTimeout(() => {
    logger.error("Graceful shutdown timed out, forcing exit");
    process.exit(1);
  }, SHUTDOWN_TIMEOUT_MS);

  forceExit.unref();

  server.close(async () => {
    try {
      await prisma.$disconnect();
      logger.info("Database disconnected successfully");
      logger.info("Graceful shutdown complete");
      process.exit(0);
    } catch (err) {
      logger.error(err, "err during shutdown");
      process.exit(1);
    }
  });
}

const startServer = async () => {
  try {
    await prisma.$connect();
    logger.info("Database connected successfully");

    const server = app.listen(env.PORT, () =>
      logger.info(`server is running on http://localhost:${env.PORT}/`),
    );

    process.on("SIGINT", (signal) => gracefulShutdown(signal, server));
    process.on("SIGTERM", (signal) => gracefulShutdown(signal, server));
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error(String(error));
    logger.error(err);
    process.exit(1);
  }
};

startServer();
