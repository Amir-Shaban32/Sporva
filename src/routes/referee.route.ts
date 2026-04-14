import { Router } from "express";
import { validate } from "../middleware/validate.middleware";
import {
  createRefereeValidation,
  updateRefereeValidation,
} from "../validations/referee.validation";
import {
  createReferee,
  getRefereeById,
  getRefereeByName,
  getRefereesByMatch,
  getRefereeByNationality,
  updateReferee,
  deleteReferee,
  countReferees,
} from "../controllers";
import { sensitiveWriteLimiter } from "../middleware/rate_limit.middleware";

const router: Router = Router();

router.get("/:id", getRefereeById);
router.get("/name", getRefereeByName);
router.get("/nationality", getRefereeByNationality);
router.get("/:matchId", getRefereesByMatch);
router.get("/count", countReferees);
router.post(
  "/",
  sensitiveWriteLimiter,
  validate(createRefereeValidation),
  createReferee,
);
router.patch(
  "/:id",
  sensitiveWriteLimiter,
  validate(updateRefereeValidation),
  updateReferee,
);
router.delete("/:id", sensitiveWriteLimiter, deleteReferee);

export default router;
