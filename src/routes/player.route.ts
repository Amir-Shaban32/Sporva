import { Router } from "express";
import { validate } from "../middleware/validate.middleware";
import {
  createPlayerValidation,
  updatePlayerValidation,
} from "../validations/player.validation";
import {
  playerNameValidation,
  nationalityValidation,
  positionValidation,
} from "../validations/query.validation";
import {
  idParamsValidation,
  teamIdParamsValidation,
} from "../validations/params.validation";
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
import { paginationValidation } from "../validations/query.validation";
import { authentication } from "../middleware/authentication";
import { verifyRole } from "../middleware/verify-role";

const router: Router = Router();

router.get("/", validate(paginationValidation, "query"), getAllPlayers);
router.get("/name", validate(playerNameValidation, "query"), getPlayerByName);
router.get(
  "/nationality",
  validate(nationalityValidation, "query"),
  getPlayerByNationality,
);
router.get(
  "/position",
  validate(positionValidation, "query"),
  getPlayerByPosition,
);
router.get("/count", countPlayers);
router.get("/:id", validate(idParamsValidation, "params"), getPlayerById);
router.get(
  "/team/:teamId",
  validate(teamIdParamsValidation, "params"),
  getPlayerByTeam,
);

router.use(authentication);

router.post(
  "/",
  sensitiveWriteLimiter,
  verifyRole("ADMIN"),
  validate(createPlayerValidation),
  createPlayer,
);
router.patch(
  "/:id",
  sensitiveWriteLimiter,
  verifyRole("ADMIN"),
  validate(updatePlayerValidation),
  updatePlayer,
);
router.delete(
  "/:id",
  sensitiveWriteLimiter,
  verifyRole("ADMIN"),
  validate(idParamsValidation, "params"),
  deletePlayer,
);

export default router;
