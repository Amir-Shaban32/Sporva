import { Router } from "express";
import { validate } from "../middleware/validate";
import { createTransferValidation } from "../validations/transfer.validation";
import {
  createTransfer,
  getTransfersByPlayer,
  getTransfersByTeam,
} from "../controllers";

const router: Router = Router();

router.get("/:playerId", getTransfersByPlayer);
router.get("/:teamId", getTransfersByTeam);
router.post("/", validate(createTransferValidation), createTransfer);

export default router;
