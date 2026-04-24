import { Router } from "express";
import { validate } from "../middleware/validate.middleware";
import { createTransferValidation } from "../validations/transfer.validation";
import {
  playerIdParamsValidation,
  teamIdParamsValidation,
} from "../validations/params.validation";
import {
  countTransfers,
  createTransfer,
  getAllTrans,
  getTransfersByPlayer,
  getTransfersByTeam,
} from "../controllers";
import { sensitiveWriteLimiter } from "../middleware/rate-limit.middleware";
import { paginationValidation } from "../validations/query.validation";
import { authentication } from "../middleware/authentication";
import { verifyRole } from "../middleware/verify-role";

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
