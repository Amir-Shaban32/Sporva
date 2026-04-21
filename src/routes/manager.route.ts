import { Router } from "express";
import { validate } from "../middleware/validate.middleware";
import {
  createManagerValidation,
  updateManagerValidation,
} from "../validations/manager.validation";
import {
  createManager,
  getManagerByName,
  getManagerByNationality,
  getManagerById,
  updateManager,
  deleteManager,
  countManagers,
  getAllManagers,
} from "../controllers";
import { sensitiveWriteLimiter } from "../middleware/rate-limit.middleware";
import { paginationValidation } from "../validations/pagination.validation";

const router: Router = Router();

router.get("/", validate(paginationValidation, "query"), getAllManagers);
router.get("/name", getManagerByName);
router.get("/nationality", getManagerByNationality);
router.get("/count", countManagers);
router.get("/:id", getManagerById);
router.post(
  "/",
  sensitiveWriteLimiter,
  validate(createManagerValidation),
  createManager,
);
router.patch(
  "/:id",
  sensitiveWriteLimiter,
  validate(updateManagerValidation),
  updateManager,
);
router.delete("/:id", sensitiveWriteLimiter, deleteManager);

export default router;
