import { Router } from "express";
import {
  createTeamValidation,
  updateTeamValidation,
} from "../../validations/team.validation";
import {
  cityValidation,
  nameValidation,
  paginationValidation,
} from "../../validations/query.validation";
import { idParamsValidation } from "../../validations/params.validation";
import {
  createTeam,
  getAllTeams,
  getTeamById,
  getTeamByCity,
  getTeamByName,
  updateTeam,
  deleteTeam,
  countTeams,
} from "../../controllers";
import { validate } from "../../middleware/validate.middleware";
import { sensitiveWriteLimiter } from "../../middleware/rate-limit.middleware";
import { authentication } from "../../middleware/authentication";
import { verifyRole } from "../../middleware/verify-role";

const router: Router = Router();

router.get("/", validate(paginationValidation, "query"), getAllTeams);
router.get("/city", validate(cityValidation, "query"), getTeamByCity);
router.get("/name", validate(nameValidation, "query"), getTeamByName);
router.get("/count", countTeams);
router.get("/:id", validate(idParamsValidation, "params"), getTeamById);

router.use(authentication);
router.post(
  "/",
  sensitiveWriteLimiter,
  verifyRole("ADMIN"),
  validate(createTeamValidation),
  createTeam,
);
router.patch(
  "/:id",
  sensitiveWriteLimiter,
  verifyRole("ADMIN"),
  validate(updateTeamValidation),
  updateTeam,
);
router.delete(
  "/:id",
  sensitiveWriteLimiter,
  verifyRole("ADMIN"),
  validate(idParamsValidation, "params"),
  deleteTeam,
);

export default router;
