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
  getPlayerById,
  updatePlayer,
  deletePlayer,
  countPlayers,
  getAllPlayers,
} from "../controllers";
import { sensitiveWriteLimiter } from "../middleware/rate-limit.middleware";
import { paginationValidation } from "../validations/pagination.validation";

const router: Router = Router();

router.get("/", validate(paginationValidation, "query"), getAllPlayers);
router.get("/name", getPlayerByName);
router.get("/nationality", getPlayerByNationality);
router.get("/position", getPlayerByPosition);
router.get("/count", countPlayers);
router.get("/:id", getPlayerById);
router.get("/team/:teamId", getPlayerByTeam);
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
