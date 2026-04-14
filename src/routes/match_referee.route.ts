import { Router } from "express";
import { validate } from "../middleware/validate.middleware";
import {
  createMatchRefereeValidation,
  updateMatchRefereeValidation,
} from "../validations/match_referee.validation";
import {
  assignRefereeToMatch,
  getMatchByReferee,
  unAssignRefereeFromMatch,
} from "../controllers";
import { sensitiveWriteLimiter } from "../middleware/rate_limit.middleware";

const router: Router = Router();

router.get("/:refereeId", getMatchByReferee);
router.post(
  "/assign",
  sensitiveWriteLimiter,
  validate(createMatchRefereeValidation),
  assignRefereeToMatch,
);
router.delete(
  "/unassign",
  sensitiveWriteLimiter,
  validate(updateMatchRefereeValidation),
  unAssignRefereeFromMatch,
);

export default router;
