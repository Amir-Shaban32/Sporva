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
import { sensitiveWriteLimiter } from "../middleware/rate-limit.middleware";
import { paginationValidation } from "../validations/pagination.validation";

const router: Router = Router();

router.get("/", validate(paginationValidation, "query"), getAllUsers);
router.get("/username", getUserByUsername);
router.get("/email", getUserByEmail);
router.get("/count", countUsers);
router.get("/:id", getUserById);
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

export default router;
