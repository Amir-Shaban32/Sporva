import { Router } from "express";
import { validate } from "../middleware/validate.middleware";
import {
  createPlayerContractValidation,
  updatePlayerContractValidation,
} from "../validations/player-contract.validation";
import {
  createPlayerContract,
  getActivePlayerContracts,
  getExpiredPlayerContracts,
  getPlayerContractsByPlayer,
  deActivatePlayerContract,
  getPlayerContractsByInterval,
  getAllPlayerContracts,
  countPlayerContracts,
} from "../controllers";
import { sensitiveWriteLimiter } from "../middleware/rate-limit.middleware";
import { paginationValidation } from "../validations/pagination.validation";

const router: Router = Router();

router.get("/", validate(paginationValidation, "query"), getAllPlayerContracts);
router.get("/active", getActivePlayerContracts);
router.get("/expired", getExpiredPlayerContracts);
router.get("/interval", getPlayerContractsByInterval);
router.get("/count", countPlayerContracts);
router.get("/:playerId", getPlayerContractsByPlayer);
router.post(
  "/",
  sensitiveWriteLimiter,
  validate(createPlayerContractValidation),
  createPlayerContract,
);
router.patch(
  "/:id",
  sensitiveWriteLimiter,
  validate(updatePlayerContractValidation),
  deActivatePlayerContract,
);

export default router;
