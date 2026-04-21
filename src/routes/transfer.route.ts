import { Router } from "express";
import { validate } from "../middleware/validate.middleware";
import { createTransferValidation } from "../validations/transfer.validation";
import {
  countTransfers,
  createTransfer,
  getAllTrans,
  getTransfersByPlayer,
  getTransfersByTeam,
} from "../controllers";
import { sensitiveWriteLimiter } from "../middleware/rate-limit.middleware";
import { paginationValidation } from "../validations/pagination.validation";

const router: Router = Router();

router.get("/", validate(paginationValidation, "query"), getAllTrans);
router.get("/count", countTransfers);
router.get("/player/:playerId", getTransfersByPlayer);
router.get("/team/:teamId", getTransfersByTeam);
router.post(
  "/",
  sensitiveWriteLimiter,
  validate(createTransferValidation),
  createTransfer,
);

export default router;
