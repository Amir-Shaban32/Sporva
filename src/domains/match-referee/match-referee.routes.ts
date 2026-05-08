import { Router } from "express";
import {
  createMatchRefereeValidation,
  updateMatchRefereeValidation,
} from "./match-referee.validation";
import { refereeIdParamsValidation } from "@shared/utils/params.validation";
import {
  assignRefereeToMatch,
  getMatchByReferee,
  unAssignRefereeFromMatch,
} from "./match-referee.controller";
import { validate } from "@shared/middleware/validate.middleware";
import { sensitiveWriteLimiter } from "@shared/middleware/rate-limit.middleware";
import { authentication } from "@shared/middleware/authentication";
import { verifyRole } from "@shared/middleware/verify-role";

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
