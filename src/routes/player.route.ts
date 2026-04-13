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

const router: Router = Router();

router.get("/name", getPlayerByName);
router.get("/nationality", getPlayerByNationality);
router.get("position", getPlayerByPosition);
router.get("/:teamId", getPlayerByTeam);
router.get("/count", countPlayers);
router.post("/", validate(createPlayerValidation), createPlayer);
router.patch("/:id", validate(updatePlayerValidation), updatePlayer);
router.delete("/:id", deletePlayer);

export default router;
