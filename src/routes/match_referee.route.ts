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

const router: Router = Router();

router.get("/:refereeId", getMatchByReferee);
router.post(
  "/assign",
  validate(createMatchRefereeValidation),
  assignRefereeToMatch,
);
router.delete(
  "/unassign",
  validate(updateMatchRefereeValidation),
  unAssignRefereeFromMatch,
);

export default router;
