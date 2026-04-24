import { Router } from "express";
import { validate } from "../middleware/validate.middleware";
import {
  createRefereeValidation,
  updateRefereeValidation,
} from "../validations/referee.validation";
import {
  idParamsValidation,
  matchIdParamsValidation,
} from "../validations/params.validation";
import {
  nameValidation,
  nationalityValidation,
} from "../validations/query.validation";
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
} from "../controllers";
import { sensitiveWriteLimiter } from "../middleware/rate-limit.middleware";
import { paginationValidation } from "../validations/query.validation";
import { authentication } from "../middleware/authentication";
import { verifyRole } from "../middleware/verify-role";

const router: Router = Router();

router.get("/", validate(paginationValidation, "query"), getAllReferees);
router.get("/name", validate(nameValidation, "query"), getRefereeByName);
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
