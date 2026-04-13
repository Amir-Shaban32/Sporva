import { Router } from "express";
import { validate } from "../middleware/validate.middleware";
import {
  createMatchEventValidation,
  updateMatchEventValidation,
} from "../validations/match_event.validation";
import {
  createMatchEvent,
  getMatchEventsByMatch,
  getMatchEventsByType,
  getMatchEventsByPlayer,
  deleteMatchEvent,
} from "../controllers";

const router: Router = Router();

router.get("/:matchId", getMatchEventsByMatch);
router.get("/", getMatchEventsByType);
router.get("/playerId", getMatchEventsByPlayer);
router.post("/", validate(createMatchEventValidation), createMatchEvent);
router.delete("/:id", deleteMatchEvent);

export default router;
