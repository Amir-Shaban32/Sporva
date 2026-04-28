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
import {
  paginationValidation,
  playerNameValidation,
  nationalityValidation,
} from "../validations/query.validation";
import { idParamsValidation } from "../validations/params.validation";
import { authentication } from "../middleware/authentication";
import { verifyRole } from "../middleware/verify-role";

const router: Router = Router();

router.get("/", validate(paginationValidation, "query"), getAllManagers);
router.get("/name", validate(playerNameValidation, "query"), getManagerByName);
router.get(
  "/nationality",
  validate(nationalityValidation, "query"),
  getManagerByNationality,
);
router.get("/count", countManagers);
router.get("/:id", validate(idParamsValidation, "params"), getManagerById);

router.use(authentication);

router.post(
  "/",
  sensitiveWriteLimiter,
  verifyRole("ADMIN"),
  validate(createManagerValidation),
  createManager,
);
router.patch(
  "/:id",
  sensitiveWriteLimiter,
  verifyRole("ADMIN"),
  validate(updateManagerValidation),
  updateManager,
);
router.delete(
  "/:id",
  sensitiveWriteLimiter,
  verifyRole("ADMIN"),
  validate(idParamsValidation, "params"),
  deleteManager,
);

export default router;
