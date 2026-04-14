import { Router } from "express";
import { validate } from "../middleware/validate.middleware";
import {
  createPlayerValidation,
  updatePlayerValidation,
} from "../validations/player.validation";
import {
  createPlayer,
  getPlayerByName,
  getPlayerByNationality,
  getPlayerByPosition,
  getPlayerByTeam,
  updatePlayer,
  deletePlayer,
  countPlayers,
} from "../controllers";
import { sensitiveWriteLimiter } from "../middleware/rate_limit.middleware";

const router: Router = Router();

router.get("/name", getPlayerByName);
router.get("/nationality", getPlayerByNationality);
router.get("position", getPlayerByPosition);
router.get("/:teamId", getPlayerByTeam);
router.get("/count", countPlayers);
router.post(
  "/",
  sensitiveWriteLimiter,
  validate(createPlayerValidation),
  createPlayer,
);
router.patch(
  "/:id",
  sensitiveWriteLimiter,
  validate(updatePlayerValidation),
  updatePlayer,
);
router.delete("/:id", sensitiveWriteLimiter, deletePlayer);

export default router;
