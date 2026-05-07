import express, { Application } from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { responseMiddleware } from "./middleware/response.middleware";
import { errorHandler } from "./middleware/error-handler.middleware";
import { notFoundHandler } from "./middleware/error-handler.middleware";
import httpLogger from "./middleware/request-log.middleware";
import { requestId } from "./middleware/request-id";
import { corsConfig } from "./config/cors.config";
import v1Router from "./routes/v1";
import healthRouter from "./routes/health.route";
import authRouter from "./routes/auth/auth.route";

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
