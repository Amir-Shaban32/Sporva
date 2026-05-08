import express, { Application } from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { responseMiddleware } from "@shared/middleware/response.middleware";
import { errorHandler } from "@shared/middleware/error-handler.middleware";
import { notFoundHandler } from "@shared/middleware/error-handler.middleware";
import httpLogger from "@shared/middleware/request-log.middleware";
import { requestId } from "@shared/middleware/request-id";
import { corsConfig } from "@shared/config";
import v1Router from "@shared/routes/v1";
import healthRouter from "@shared/health/health.routes";
import authRouter from "@domains/auth/auth.routes";

const app: Application = express();

app.set("trust proxy", 1);
app.use(requestId);
app.use(httpLogger);
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);
app.use(corsConfig);
app.options("/{*any}", corsConfig);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(responseMiddleware);
app.use(cookieParser());

app.use("/health", healthRouter);
app.use("/api/v1", v1Router);
app.use("/auth", authRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
