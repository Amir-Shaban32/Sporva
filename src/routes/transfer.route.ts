import { Router } from "express";
import { validate } from "../middleware/validate.middleware";
import { createTransferValidation } from "../validations/transfer.validation";
import {
  createTransfer,
  getTransfersByPlayer,
  getTransfersByTeam,
} from "../controllers";
import { sensitiveWriteLimiter } from "../middleware/rate_limit.middleware";

const router: Router = Router();

router.get("/:playerId", getTransfersByPlayer);
router.get("/:teamId", getTransfersByTeam);
router.post(
  "/",
  sensitiveWriteLimiter,
  validate(createTransferValidation),
  createTransfer,
);

export default router;
