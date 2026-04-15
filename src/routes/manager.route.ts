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
  updateManager,
  deleteManager,
  countManagers,
} from "../controllers";
import { sensitiveWriteLimiter } from "../middleware/rate-limit.middleware";

const router: Router = Router();

router.get("/name", getManagerByName);
router.get("/nationality", getManagerByNationality);
router.get("/count", countManagers);
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
