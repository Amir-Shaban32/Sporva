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

const router: Router = Router();

router.get("/:id", getTeamById);
router.get("/city", getTeamByCity);
router.get("/name", getTeamByName);
router.post("/", validate(createTeamValidation), createTeam);
router.patch("/:id", validate(updateTeamValidation), updateTeam);
router.delete("/:id", deleteTeam);
router.get("/count", countTeams);

export default router;
