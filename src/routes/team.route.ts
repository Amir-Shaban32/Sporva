import { Router } from "express";
import { validate } from "../middleware/validate.middleware";
import {
  createTeamValidation,
  updateTeamValidation,
} from "../validations/team.validation";
import {
  createTeam,
  getTeamById,
  getTeamByCity,
  getTeamByName,
  updateTeam,
  deleteTeam,
  countTeams,
} from "../controllers";
import { sensitiveWriteLimiter } from "../middleware/rate_limit.middleware";

const router: Router = Router();

router.get("/:id", getTeamById);
router.get("/city", getTeamByCity);
router.get("/name", getTeamByName);
router.post(
  "/",
  sensitiveWriteLimiter,
  validate(createTeamValidation),
  createTeam,
);
router.patch(
  "/:id",
  sensitiveWriteLimiter,
  validate(updateTeamValidation),
  updateTeam,
);
router.delete("/:id", sensitiveWriteLimiter, deleteTeam);
router.get("/count", countTeams);

export default router;
