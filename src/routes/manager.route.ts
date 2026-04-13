import { Router } from "express";
import { validate } from "../middleware/validate.middleware";
import {
  createManagerValidation,
  updateManagerValidation,
} from "../validations/manager.validation";
import {
  createManager,
  getManagerByName,
  getManagerByNationality,
  updateManager,
  deleteManager,
  countManagers,
} from "../controllers";

const router: Router = Router();

router.get("/name", getManagerByName);
router.get("/nationality", getManagerByNationality);
router.get("/count", countManagers);
router.post("/", validate(createManagerValidation), createManager);
router.patch("/:id", validate(updateManagerValidation), updateManager);
router.delete("/:id", deleteManager);

export default router;
