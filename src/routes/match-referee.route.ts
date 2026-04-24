import { Router } from "express";
import { validate } from "../middleware/validate.middleware";
import {
  createMatchRefereeValidation,
  updateMatchRefereeValidation,
} from "../validations/match-referee.validation";
import { refereeIdParamsValidation } from "../validations/params.validation";
import {
  assignRefereeToMatch,
  getMatchByReferee,
  unAssignRefereeFromMatch,
} from "../controllers";
import { sensitiveWriteLimiter } from "../middleware/rate-limit.middleware";
import { authentication } from "../middleware/authentication";
import { verifyRole } from "../middleware/verify-role";

const router: Router = Router();

router.get(
  "/:refereeId",
  validate(refereeIdParamsValidation, "params"),
  getMatchByReferee,
);

router.use(authentication);

router.post(
  "/assign",
  sensitiveWriteLimiter,
  verifyRole("ADMIN"),
  validate(createMatchRefereeValidation),
  assignRefereeToMatch,
);
router.delete(
  "/unassign",
  sensitiveWriteLimiter,
  verifyRole("ADMIN"),
  validate(updateMatchRefereeValidation),
  unAssignRefereeFromMatch,
);

export default router;
