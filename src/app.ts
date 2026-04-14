import express, { Application } from "express";
import userRouter from "./routes/user.route";
import transferRouter from "./routes/transfer.route";
import teamRouter from "./routes/team.route";
import refereeRouter from "./routes/referee.route";
import playerRouter from "./routes/player.route";
import playerContractRouter from "./routes/player_contract.route";
import matchRouter from "./routes/manager.route";
import matchRefereeRouter from "./routes/match_referee.route";
import matchEventRouter from "./routes/match_event.route";
import managerRouter from "./routes/manager.route";
import managerContractRouter from "./routes/manager_contract.route";
import leagueStandingsRouter from "./routes/league_standing.route";
import authRouter from "./routes/auth/auth.route";

const app: Application = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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

export default app;
