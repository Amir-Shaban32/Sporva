import { Router } from "express";
import {
  createMatchValidation,
  updateMatchValidation,
} from "../../validations/match";
import {
  roundValidation,
  seasonValidation,
  matchStatusValidation,
  competitionValidation,
  dateValidation,
} from "../../validations/query.validation";
import {
  idParamsValidation,
  teamIdParamsValidation,
} from "../../validations/params.validation";
import {
  scheduleMatch,
  getMatchByTeam,
  getMatchById,
  getLiveMatches,
  getMatchesByStatus,
  getMatchesByCompetition,
  getMatchesByDate,
  getMatchesByRound,
  getMatchesBySeasonEndpoint,
  getMatchesWithExtraTime,
  getMatchesWithPenalties,
  updateMatch,
  recordMatchResult,
  updateMatchStatus,
} from "../../controllers";
import { validate } from "../../middleware/validate.middleware";
import { sensitiveWriteLimiter } from "../../middleware/rate-limit.middleware";
import { authentication } from "../../middleware/authentication";
import { verifyRole } from "../../middleware/verify-role";

const router: Router = Router();

router.get("/live", getLiveMatches);
router.get(
  "/status",
  validate(matchStatusValidation, "query"),
  getMatchesByStatus,
);
router.get(
  "/competition",
  validate(competitionValidation, "query"),
  getMatchesByCompetition,
);
router.get("/date", validate(dateValidation, "query"), getMatchesByDate);
router.get(
  "/season",
  validate(seasonValidation, "query"),
  getMatchesBySeasonEndpoint,
);
router.get("/round", validate(roundValidation, "query"), getMatchesByRound);
router.get("/extra", getMatchesWithExtraTime);
router.get("/penalties", getMatchesWithPenalties);
router.get("/:id", validate(idParamsValidation, "params"), getMatchById);
router.get(
  "/team/:teamId",
  validate(teamIdParamsValidation, "params"),
  getMatchByTeam,
);

router.use(authentication);
router.post(
  "/",
  sensitiveWriteLimiter,
  verifyRole("ADMIN"),
  validate(createMatchValidation),
  scheduleMatch,
);
router.patch(
  "/:id",
  sensitiveWriteLimiter,
  verifyRole("ADMIN"),
  validate(updateMatchValidation),
  updateMatch,
);

router.patch(
  "/:id/status",
  sensitiveWriteLimiter,
  verifyRole("ADMIN"),
  validate(idParamsValidation, "params"),
  validate(matchStatusValidation),
  updateMatchStatus,
);

router.patch(
  "/:id/result",
  sensitiveWriteLimiter,
  verifyRole("ADMIN"),
  validate(idParamsValidation, "params"),
  recordMatchResult,
);

export default router;
