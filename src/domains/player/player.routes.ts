import { Router } from "express";
import {
  createPlayerValidation,
  updatePlayerValidation,
} from "./player.validation";
import {
  playerNameValidation,
  nationalityValidation,
  positionValidation,
} from "@shared/utils/query.validation";
import {
  idParamsValidation,
  teamIdParamsValidation,
} from "@shared/utils/params.validation";
import { paginationValidation } from "@shared/utils/query.validation";
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
} from "./player.controller";
import { validate } from "@shared/middleware/validate.middleware";
import { sensitiveWriteLimiter } from "@shared/middleware/rate-limit.middleware";
import { authentication } from "@shared/middleware/authentication";
import { verifyRole } from "@shared/middleware/verify-role";

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
