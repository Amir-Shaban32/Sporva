import { Router } from "express";
import {
  createUserValidation,
  updateUserValidation,
} from "../../validations/user.validation";
import { idParamsValidation } from "../../validations/params.validation";
import {
  usernameValidation,
  emailValidation,
} from "../../validations/query.validation";
import { paginationValidation } from "../../validations/query.validation";
import {
  createUser,
  getUserById,
  getUserByEmail,
  getUserByUsername,
  getAllUsers,
  updateUser,
  deleteUser,
  countUsers,
} from "../../controllers";
import { validate } from "../../middleware/validate.middleware";
import { sensitiveWriteLimiter } from "../../middleware/rate-limit.middleware";
import { authentication } from "../../middleware/authentication";
import { verifyRole } from "../../middleware/verify-role";

const router: Router = Router();

router.use(authentication);

router.get(
  "/",
  verifyRole("ADMIN"),
  validate(paginationValidation, "query"),
  getAllUsers,
);
router.get(
  "/username",
  validate(usernameValidation, "query"),
  getUserByUsername,
);
router.get("/email", validate(emailValidation, "query"), getUserByEmail);
router.get("/count", verifyRole("ADMIN"), countUsers);
router.get("/:id", validate(idParamsValidation, "params"), getUserById);
router.post(
  "/",
  sensitiveWriteLimiter,
  verifyRole("ADMIN"),
  validate(createUserValidation),
  createUser,
);
router.patch(
  "/:id",
  sensitiveWriteLimiter,
  validate(updateUserValidation),
  updateUser,
);
router.delete(
  "/:id",
  sensitiveWriteLimiter,
  validate(idParamsValidation, "params"),
  deleteUser,
);

export default router;
