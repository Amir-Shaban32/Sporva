import { Router } from "express";
import { validate } from "../middleware/validate.middleware";
import {
  createPlayerContractValidation,
  updatePlayerContractValidation,
} from "../validations/player_contract.validation";
import {
  createPlayerContract,
  getActivePlayerContracts,
  getExpiredPlayerContracts,
  getPlayerContractsByPlayer,
  deActivatePlayerContract,
  getPlayerContractsByInterval,
} from "../controllers";
import { sensitiveWriteLimiter } from "../middleware/rate_limit.middleware";

const router: Router = Router();

router.get("/active", getActivePlayerContracts);
router.get("expired", getExpiredPlayerContracts);
router.get("/:playerId", getPlayerContractsByPlayer);
router.get("/interval", getPlayerContractsByInterval);
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
