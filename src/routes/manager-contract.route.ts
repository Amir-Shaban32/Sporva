import { Router } from "express";
import { validate } from "../middleware/validate.middleware";
import {
  createManagerContractValidation,
  updateManagerContractValidation,
} from "../validations/manager-contract.validation";
import {
  createManagerContract,
  getActiveManagerContracts,
  getExpiredManagerContracts,
  getManagerContractsByManager,
  getManagerContractsByInterval,
  deActivateManagerContract,
} from "../controllers";
import { sensitiveWriteLimiter } from "../middleware/rate-limit.middleware";

const router: Router = Router();

router.get("/active", getActiveManagerContracts);
router.get("/expired", getExpiredManagerContracts);
router.get("/:managerId", getManagerContractsByManager);
router.get("/interval", getManagerContractsByInterval);
router.post(
  "/",
  sensitiveWriteLimiter,
  validate(createManagerContractValidation),
  createManagerContract,
);
router.patch(
  "/:id",
  sensitiveWriteLimiter,
  validate(updateManagerContractValidation),
  deActivateManagerContract,
);

export default router;
