import { Router } from "express";
import { createManagerContractValidation } from "../../validations/manager-contract.validation";
import { paginationValidation } from "../../validations/query.validation";
import { intervalValidation } from "../../validations/query.validation";
import {
  idParamsValidation,
  managerIdParamsValidation,
} from "../../validations/params.validation";
import {
  createManagerContract,
  getActiveManagerContracts,
  getExpiredManagerContracts,
  getManagerContractsByManager,
  getManagerContractsByInterval,
  deActivateManagerContract,
  getAllManagerContracts,
  countManagerContracts,
} from "../../controllers";
import { validate } from "../../middleware/validate.middleware";
import { sensitiveWriteLimiter } from "../../middleware/rate-limit.middleware";
import { authentication } from "../../middleware/authentication";
import { verifyRole } from "../../middleware/verify-role";

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
