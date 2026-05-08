import { Router } from "express";
import { createTransferValidation } from "./transfer.validation";
import { paginationValidation } from "@shared/utils/query.validation";
import {
  playerIdParamsValidation,
  teamIdParamsValidation,
} from "@shared/utils/params.validation";
import {
  countTransfers,
  createTransfer,
  getAllTrans,
  getTransfersByPlayer,
  getTransfersByTeam,
} from "./transfer.controller";
import { validate } from "@shared/middleware/validate.middleware";
import { sensitiveWriteLimiter } from "@shared/middleware/rate-limit.middleware";
import { authentication } from "@shared/middleware/authentication";
import { verifyRole } from "@shared/middleware/verify-role";

const router: Router = Router();

router.get("/", validate(paginationValidation, "query"), getAllTrans);
router.get("/count", countTransfers);
router.get(
  "/player/:playerId",
  validate(playerIdParamsValidation, "params"),
  getTransfersByPlayer,
);
router.get(
  "/team/:teamId",
  validate(teamIdParamsValidation, "params"),
  getTransfersByTeam,
);
router.post(
  "/",
  sensitiveWriteLimiter,
  authentication,
  verifyRole("ADMIN"),
  validate(createTransferValidation),
  createTransfer,
);

export default router;
