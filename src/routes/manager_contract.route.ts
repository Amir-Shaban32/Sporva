import { Router } from "express";
import { validate } from "../middleware/validate";
import {
  createManagerContractValidation,
  updateManagerContractValidation,
} from "../validations/manager_contract.validation";
import {
  createManagerContract,
  getActiveManagerContracts,
  getExpiredManagerContracts,
  getManagerContractsByManager,
  getManagerContractsByInterval,
  deActivateManagerContract,
} from "../controllers";

const router: Router = Router();

router.get("/active", getActiveManagerContracts);
router.get("/expired", getExpiredManagerContracts);
router.get("/:managerId", getManagerContractsByManager);
router.get("/interval", getManagerContractsByInterval);
router.post(
  "/",
  validate(createManagerContractValidation),
  createManagerContract,
);
router.patch(
  "/:id",
  validate(updateManagerContractValidation),
  deActivateManagerContract,
);

export default router;
