import { Router } from "express";
import { validate } from "../middleware/validate.middleware";
import {
  createTeamValidation,
  updateTeamValidation,
} from "../validations/team.validation";
import {
  createTeam,
  getAllTeams,
  getTeamById,
  getTeamByCity,
  getTeamByName,
  updateTeam,
  deleteTeam,
  countTeams,
} from "../controllers";
import { sensitiveWriteLimiter } from "../middleware/rate-limit.middleware";
import { paginationValidation } from "../validations/pagination.validation";

const router: Router = Router();

router.get("/", validate(paginationValidation, "query"), getAllTeams);
router.get("/city", getTeamByCity);
router.get("/name", getTeamByName);
router.get("/count", countTeams);
router.get("/:id", getTeamById);
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

export default router;
