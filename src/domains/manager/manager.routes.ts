import { Router } from "express";
import {
  createManagerValidation,
  updateManagerValidation,
} from "./manager.validation";
import {
  paginationValidation,
  playerNameValidation,
  nationalityValidation,
} from "@shared/utils/query.validation";
import { idParamsValidation } from "@shared/utils/params.validation";
import {
  createManager,
  getManagerByName,
  getManagerByNationality,
  getManagerById,
  updateManager,
  deleteManager,
  countManagers,
  getAllManagers,
} from "./manager.controller";
import { validate } from "@shared/middleware/validate.middleware";
import { sensitiveWriteLimiter } from "@shared/middleware/rate-limit.middleware";
import { authentication } from "@shared/middleware/authentication";
import { verifyRole } from "@shared/middleware/verify-role";

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
