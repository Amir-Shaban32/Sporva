import express, { Application } from "express";
import helmet from "helmet";
import { responseMiddleware } from "./middleware/response.middleware";
import userRouter from "./routes/user.route";
import transferRouter from "./routes/transfer.route";
import teamRouter from "./routes/team.route";
import refereeRouter from "./routes/referee.route";
import playerRouter from "./routes/player.route";
import playerContractRouter from "./routes/player-contract.route";
import matchRouter from "./routes/match.route";
import matchRefereeRouter from "./routes/match-referee.route";
import matchEventRouter from "./routes/match-event.route";
import managerRouter from "./routes/manager.route";
import managerContractRouter from "./routes/manager-contract.route";
import leagueStandingsRouter from "./routes/league-standing.route";
import authRouter from "./routes/auth/auth.route";
import { errorHandler } from "./middleware/error-handler.middleware";
import cookieParser from "cookie-parser";
import { notFoundHandler } from "./middleware/error-handler.middleware";
import httpLogger from "./middleware/request-log.middleware";
import { corsConfig } from "./config/cors.config";
import { requestId } from "./middleware/request-id";

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

app.use("/api/users", userRouter);
app.use("/api/transfers", transferRouter);
app.use("/api/teams", teamRouter);
app.use("/api/referees", refereeRouter);
app.use("/api/players", playerRouter);
app.use("/api/playersContracts", playerContractRouter);
app.use("/api/matches", matchRouter);
app.use("/api/matchReferees", matchRefereeRouter);
app.use("/api/matchEvents", matchEventRouter);
app.use("/api/managers", managerRouter);
app.use("/api/managerContracts", managerContractRouter);
app.use("/api/league", leagueStandingsRouter);
app.use("/auth", authRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
