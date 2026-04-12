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

const app: Application = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/users", userRouter);
app.use("/transfers", transferRouter);
app.use("/teams", teamRouter);
app.use("/referees", refereeRouter);
app.use("/players", playerRouter);
app.use("/playersContracts", playerContractRouter);
app.use("/matches", matchRouter);
app.use("/matchReferees", matchRefereeRouter);
app.use("/matchEvents", matchEventRouter);
app.use("/managers", managerRouter);
app.use("/managerContracts", managerContractRouter);
app.use("/league", leagueStandingsRouter);

export default app;
