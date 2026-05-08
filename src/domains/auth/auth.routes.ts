import { Router } from "express";
import {
  handleLogin,
  handleLogout,
  handleRegister,
  handleRefreshToken,
} from "./auth.controller";
import { loginValidation, registerValidation } from "./auth.validation";
import { validate } from "@shared/middleware/validate.middleware";
import {
  authLimiter,
  refreshTokenLimiter,
} from "@shared/middleware/rate-limit.middleware";

const router: Router = Router();

router.post("/login", authLimiter, validate(loginValidation), handleLogin);
router.post("/refresh", refreshTokenLimiter, handleRefreshToken);
router.post("/logout", handleLogout);

router.post(
  "/register",
  authLimiter,
  validate(registerValidation),
  handleRegister,
);

export default router;
