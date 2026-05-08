import { Router } from "express";
import { createPlayerContractValidation } from "./player-contract.validation";
import {
  idParamsValidation,
  playerIdParamsValidation,
} from "@shared/utils/params.validation";
import { intervalValidation } from "@shared/utils/query.validation";
import { paginationValidation } from "@shared/utils/query.validation";
import {
  createPlayerContract,
  getActivePlayerContracts,
  getExpiredPlayerContracts,
  getPlayerContractsByPlayer,
  deActivatePlayerContract,
  getPlayerContractsByInterval,
  getAllPlayerContracts,
  countPlayerContracts,
} from "./player-contract.controller";
import { validate } from "@shared/middleware/validate.middleware";
import { sensitiveWriteLimiter } from "@shared/middleware/rate-limit.middleware";
import { authentication } from "@shared/middleware/authentication";
import { verifyRole } from "@shared/middleware/verify-role";

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
