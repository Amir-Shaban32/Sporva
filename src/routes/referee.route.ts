import { Router } from "express";
import { validate } from "../middleware/validate.middleware";
import {
  createRefereeValidation,
  updateRefereeValidation,
} from "../validations/referee.validation";
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
import { paginationValidation } from "../validations/pagination.validation";

const router: Router = Router();

router.get("/", validate(paginationValidation, "query"), getAllReferees);
router.get("/name", getRefereeByName);
router.get("/nationality", getRefereeByNationality);
router.get("/count", countReferees);
router.get("/:id", getRefereeById);
router.get(".match/:matchId", getRefereesByMatch);
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
