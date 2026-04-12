import { Router } from "express";
import { validate } from "../middleware/validate";
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

const router: Router = Router();

router.get("/active", getActivePlayerContracts);
router.get("expired", getExpiredPlayerContracts);
router.get("/:playerId", getPlayerContractsByPlayer);
router.get("/interval", getPlayerContractsByInterval);
router.post(
  "/",
  validate(createPlayerContractValidation),
  createPlayerContract,
);
router.patch(
  "/:id",
  validate(updatePlayerContractValidation),
  deActivatePlayerContract,
);

export default router;
