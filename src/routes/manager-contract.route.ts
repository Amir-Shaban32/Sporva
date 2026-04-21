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
  getAllManagerContracts,
  countManagerContracts,
} from "../controllers";
import { sensitiveWriteLimiter } from "../middleware/rate-limit.middleware";
import { paginationValidation } from "../validations/pagination.validation";

const router: Router = Router();

router.get(
  "/",
  validate(paginationValidation, "query"),
  getAllManagerContracts,
);
router.get("/active", getActiveManagerContracts);
router.get("/expired", getExpiredManagerContracts);
router.get("/interval", getManagerContractsByInterval);
router.get("/count", countManagerContracts);
router.get("/:managerId", getManagerContractsByManager);
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
