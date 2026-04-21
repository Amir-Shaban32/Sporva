import { Router } from "express";
import { validate } from "../middleware/validate.middleware";
import {
  createMatchEventValidation,
  updateMatchEventValidation,
} from "../validations/match-event.validation";
import {
  createMatchEvent,
  getMatchEventsByMatch,
  getMatchEventsByType,
  getMatchEventsByPlayer,
  deleteMatchEvent,
} from "../controllers";
import { sensitiveWriteLimiter } from "../middleware/rate-limit.middleware";

const router: Router = Router();

router.get("/", getMatchEventsByType);
router.get("/playerId", getMatchEventsByPlayer);
router.get("/:matchId", getMatchEventsByMatch);
router.post(
  "/",
  sensitiveWriteLimiter,
  validate(createMatchEventValidation),
  createMatchEvent,
);
router.delete("/:id", sensitiveWriteLimiter, deleteMatchEvent);

export default router;
