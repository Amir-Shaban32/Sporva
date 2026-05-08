import { Router } from "express";
import { leagueSeasonValidation } from "@shared/utils/query.validation";
import {
  getLeagueTable,
  getLeagueTableByMostWins,
  getLeagueTableByMostDraws,
  getLeagueTableByLeastLosses,
  getLeagueTableByMostGoalsFor,
  getLeagueTableByLeastGoalsAgainst,
  getLeagueTableByGoalsDifference,
} from "./standings.controller";
import { validate } from "@shared/middleware/validate.middleware";

const router: Router = Router();

router.use(validate(leagueSeasonValidation, "query"));

router.get("/table", getLeagueTable);
router.get("/wins", getLeagueTableByMostWins);
router.get("/losses", getLeagueTableByLeastLosses);
router.get("/draws", getLeagueTableByMostDraws);
router.get("/goals_for", getLeagueTableByMostGoalsFor);
router.get("/goals_against", getLeagueTableByLeastGoalsAgainst);
router.get("/goals_diff", getLeagueTableByGoalsDifference);

export default router;
