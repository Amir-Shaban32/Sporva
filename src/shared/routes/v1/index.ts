import { Router } from "express";
import userRouter from "@domains/user/user.routes";
import transferRouter from "@domains/transfer/transfer.routes";
import teamRouter from "@domains/team/team.routes";
import refereeRouter from "@domains/referee/referee.routes";
import playerRouter from "@domains/player/player.routes";
import playerContractRouter from "@domains/player-contract/player-contract.routes";
import matchRouter from "@domains/match/match.routes";
import matchRefereeRouter from "@domains/match-referee/match-referee.routes";
import matchEventRouter from "@domains/match-event/match-event.routes";
import managerRouter from "@domains/manager/manager.routes";
import managerContractRouter from "@domains/manager-contract/manager-contract.routes";
import leagueStandingsRouter from "@domains/standings/standings.routes";

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
