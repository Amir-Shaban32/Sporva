import { Router } from "express";
import { createMatchEventValidation } from "../../validations/match-event.validation";
import {
  playerIdParamsValidation,
  matchIdParamsValidation,
  idParamsValidation,
} from "../../validations/params.validation";
import {
  createMatchEvent,
  getMatchEventsByMatch,
  getMatchEventsByType,
  getMatchEventsByPlayer,
  deleteMatchEvent,
} from "../../controllers";
import { validate } from "../../middleware/validate.middleware";
import { sensitiveWriteLimiter } from "../../middleware/rate-limit.middleware";
import { authentication } from "../../middleware/authentication";
import { verifyRole } from "../../middleware/verify-role";

const router: Router = Router();

router.get("/eventType", getMatchEventsByType);
router.get(
  "/player/:playerId",
  validate(playerIdParamsValidation, "params"),
  getMatchEventsByPlayer,
);
router.get(
  "/match/:matchId",
  validate(matchIdParamsValidation, "params"),
  getMatchEventsByMatch,
);

router.use(authentication);

router.post(
  "/",
  sensitiveWriteLimiter,
  verifyRole("ADMIN"),
  validate(createMatchEventValidation),
  createMatchEvent,
);
router.delete(
  "/:id",
  sensitiveWriteLimiter,
  verifyRole("ADMIN"),
  validate(idParamsValidation, "params"),
  deleteMatchEvent,
);

export default router;
