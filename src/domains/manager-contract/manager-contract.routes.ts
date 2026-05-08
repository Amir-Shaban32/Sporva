import { Router } from "express";
import { createManagerContractValidation } from "./manager-contract.validation";
import { paginationValidation } from "@shared/utils/query.validation";
import { intervalValidation } from "@shared/utils/query.validation";
import {
  idParamsValidation,
  managerIdParamsValidation,
} from "@shared/utils/params.validation";
import {
  createManagerContract,
  getActiveManagerContracts,
  getExpiredManagerContracts,
  getManagerContractsByManager,
  getManagerContractsByInterval,
  deActivateManagerContract,
  getAllManagerContracts,
  countManagerContracts,
} from "./manager-contract.controller";
import { validate } from "@shared/middleware/validate.middleware";
import { sensitiveWriteLimiter } from "@shared/middleware/rate-limit.middleware";
import { authentication } from "@shared/middleware/authentication";
import { verifyRole } from "@shared/middleware/verify-role";

const router: Router = Router();

router.get(
  "/",
  validate(paginationValidation, "query"),
  getAllManagerContracts,
);
router.get("/active", getActiveManagerContracts);
router.get("/expired", getExpiredManagerContracts);
router.get(
  "/interval",
  validate(intervalValidation, "query"),
  getManagerContractsByInterval,
);
router.get("/count", countManagerContracts);
router.get(
  "/:managerId",
  validate(managerIdParamsValidation, "params"),
  getManagerContractsByManager,
);

router.use(authentication);

router.post(
  "/",
  sensitiveWriteLimiter,
  verifyRole("ADMIN"),
  validate(createManagerContractValidation),
  createManagerContract,
);
router.patch(
  "/:id",
  sensitiveWriteLimiter,
  verifyRole("ADMIN"),
  validate(idParamsValidation, "params"),
  deActivateManagerContract,
);

export default router;
