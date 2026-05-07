import { Router } from "express";
import { createTransferValidation } from "../../validations/transfer.validation";
import { paginationValidation } from "../../validations/query.validation";
import {
  playerIdParamsValidation,
  teamIdParamsValidation,
} from "../../validations/params.validation";
import {
  countTransfers,
  createTransfer,
  getAllTrans,
  getTransfersByPlayer,
  getTransfersByTeam,
} from "../../controllers";
import { validate } from "../../middleware/validate.middleware";
import { sensitiveWriteLimiter } from "../../middleware/rate-limit.middleware";
import { authentication } from "../../middleware/authentication";
import { verifyRole } from "../../middleware/verify-role";

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
