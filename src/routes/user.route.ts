import { Router } from "express";
import { validate } from "../middleware/validate.middleware";
import {
  createUserValidation,
  updateUserValidation,
} from "../validations/user.validation";
import {
  createUser,
  getUserById,
  getUserByEmail,
  getUserByUsername,
  getAllUsers,
  updateUser,
  deleteUser,
  countUsers,
} from "../controllers";
import { sensitiveWriteLimiter } from "../middleware/rate_limit.middleware";

const router: Router = Router();

router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.get("/username", getUserByUsername);
router.get("/email", getUserByEmail);
router.post(
  "/",
  sensitiveWriteLimiter,
  validate(createUserValidation),
  createUser,
);
router.patch(
  "/:id",
  sensitiveWriteLimiter,
  validate(updateUserValidation),
  updateUser,
);
router.delete("/:id", sensitiveWriteLimiter, deleteUser);
router.get("/count", countUsers);

export default router;
