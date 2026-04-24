import { Router } from "express";
import { validate } from "../middleware/validate.middleware";
import { createPlayerContractValidation } from "../validations/player-contract.validation";
import {
  idParamsValidation,
  playerIdParamsValidation,
} from "../validations/params.validation";
import { intervalValidation } from "../validations/query.validation";
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
import { paginationValidation } from "../validations/query.validation";
import { authentication } from "../middleware/authentication";
import { verifyRole } from "../middleware/verify-role";

const router: Router = Router();

router.get("/", validate(paginationValidation, "query"), getAllPlayerContracts);
router.get("/active", getActivePlayerContracts);
router.get("/expired", getExpiredPlayerContracts);
router.get(
  "/interval",
  validate(intervalValidation, "query"),
  getPlayerContractsByInterval,
);
router.get("/count", countPlayerContracts);
router.get(
  "/:playerId",
  validate(playerIdParamsValidation, "params"),
  getPlayerContractsByPlayer,
);

router.use(authentication);

router.post(
  "/",
  sensitiveWriteLimiter,
  verifyRole("ADMIN"),
  validate(createPlayerContractValidation),
  createPlayerContract,
);
router.patch(
  "/:id",
  sensitiveWriteLimiter,
  verifyRole("ADMIN"),
  validate(idParamsValidation, "params"),
  deActivatePlayerContract,
);

export default router;
