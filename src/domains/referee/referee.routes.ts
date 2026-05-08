import { Router } from "express";
import {
  createRefereeValidation,
  updateRefereeValidation,
} from "./referee.validation";
import {
  idParamsValidation,
  matchIdParamsValidation,
} from "@shared/utils/params.validation";
import {
  nationalityValidation,
  playerNameValidation,
} from "@shared/utils/query.validation";
import { paginationValidation } from "@shared/utils/query.validation";
import {
  createReferee,
  getAllReferees,
  getRefereeById,
  getRefereeByName,
  getRefereesByMatch,
  getRefereeByNationality,
  updateReferee,
  deleteReferee,
  countReferees,
} from "./referee.controller";
import { validate } from "@shared/middleware/validate.middleware";
import { sensitiveWriteLimiter } from "@shared/middleware/rate-limit.middleware";
import { authentication } from "@shared/middleware/authentication";
import { verifyRole } from "@shared/middleware/verify-role";

const router: Router = Router();

router.get("/", validate(paginationValidation, "query"), getAllReferees);
router.get("/name", validate(playerNameValidation, "query"), getRefereeByName);
router.get(
  "/nationality",
  validate(nationalityValidation, "query"),
  getRefereeByNationality,
);
router.get("/count", countReferees);
router.get("/:id", validate(idParamsValidation, "params"), getRefereeById);
router.get(
  "/match/:matchId",
  validate(matchIdParamsValidation, "params"),
  getRefereesByMatch,
);

router.use(authentication);

router.post(
  "/",
  sensitiveWriteLimiter,
  verifyRole("ADMIN"),
  validate(createRefereeValidation),
  createReferee,
);
router.patch(
  "/:id",
  sensitiveWriteLimiter,
  verifyRole("ADMIN"),
  validate(updateRefereeValidation),
  updateReferee,
);
router.delete(
  "/:id",
  sensitiveWriteLimiter,
  verifyRole("ADMIN"),
  validate(idParamsValidation, "params"),
  deleteReferee,
);

export default router;
