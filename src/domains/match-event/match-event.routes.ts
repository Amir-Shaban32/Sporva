import { Router } from "express";
import { createMatchEventValidation } from "./match-event.validation";
import {
  playerIdParamsValidation,
  matchIdParamsValidation,
  idParamsValidation,
} from "@shared/utils/params.validation";
import {
  createMatchEvent,
  getMatchEventsByMatch,
  getMatchEventsByType,
  getMatchEventsByPlayer,
  deleteMatchEvent,
} from "./match-event.controller";
import { validate } from "@shared/middleware/validate.middleware";
import { sensitiveWriteLimiter } from "@shared/middleware/rate-limit.middleware";
import { authentication } from "@shared/middleware/authentication";
import { verifyRole } from "@shared/middleware/verify-role";

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
