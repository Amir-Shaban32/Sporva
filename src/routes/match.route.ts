import { Router } from "express";
import { validate } from "../middleware/validate.middleware";
import {
  createMatchValidation,
  updateMatchValidation,
} from "../validations/match.validation";
import {
  scheduleMatch,
  getMatchByTeam,
  getLiveMatches,
  getMatchesByStatus,
  getMatchesByCompetition,
  getMatchesByDate,
  getMatchesByRound,
  getMatchesBySeasonEndpoint,
  getMatchesWithExtraTime,
  getMatchesWithPenalties,
  updateMatch,
} from "../controllers";

const router: Router = Router();

router.get("/:teamId", getMatchByTeam);
router.get("/live", getLiveMatches);
router.get("/status", getMatchesByStatus);
router.get("/competition", getMatchesByCompetition);
router.get("/date", getMatchesByDate);
router.get("/season", getMatchesBySeasonEndpoint);
router.get("/round", getMatchesByRound);
router.get("/extra", getMatchesWithExtraTime);
router.get("/penalties", getMatchesWithPenalties);
router.post("/", validate(createMatchValidation), scheduleMatch);
router.patch("/:id", validate(updateMatchValidation), updateMatch);

export default router;
