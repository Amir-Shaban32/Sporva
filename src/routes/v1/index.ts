import { Router } from "express";
import userRouter from "./user.route";
import transferRouter from "./transfer.route";
import teamRouter from "./team.route";
import refereeRouter from "./referee.route";
import playerRouter from "./player.route";
import playerContractRouter from "./player-contract.route";
import matchRouter from "./match.route";
import matchRefereeRouter from "./match-referee.route";
import matchEventRouter from "./match-event.route";
import managerRouter from "./manager.route";
import managerContractRouter from "./manager-contract.route";
import leagueStandingsRouter from "./league-standing.route";

const v1Router: Router = Router();

v1Router.use("/users", userRouter);
v1Router.use("/transfers", transferRouter);
v1Router.use("/teams", teamRouter);
v1Router.use("/referees", refereeRouter);
v1Router.use("/players", playerRouter);
v1Router.use("/playersContracts", playerContractRouter);
v1Router.use("/matches", matchRouter);
v1Router.use("/matchReferees", matchRefereeRouter);
v1Router.use("/matchEvents", matchEventRouter);
v1Router.use("/managers", managerRouter);
v1Router.use("/managerContracts", managerContractRouter);
v1Router.use("/league", leagueStandingsRouter);

export default v1Router;
