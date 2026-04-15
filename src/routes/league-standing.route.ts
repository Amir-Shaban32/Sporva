import { Router } from "express";
import {
  getLeagueTable,
  getLeagueTableByMostWins,
  getLeagueTableByMostDraws,
  getLeagueTableByLeastLosses,
  getLeagueTableByMostGoalsFor,
  getLeagueTableByLeastGoalsAgainst,
  getLeagueTableByGoalsDifference,
} from "../controllers";

const router: Router = Router();

router.get("/table", getLeagueTable);
router.get("/wins", getLeagueTableByMostWins);
router.get("/losses", getLeagueTableByLeastLosses);
router.get("/draws", getLeagueTableByMostDraws);
router.get("/goals_for", getLeagueTableByMostGoalsFor);
router.get("/goals_against", getLeagueTableByLeastGoalsAgainst);
router.get("/goals_diff", getLeagueTableByGoalsDifference);

export default router;
