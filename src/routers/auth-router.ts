import { Router } from "express";
import {
  loginOrEmailValidation,
  passwordValidation,
} from "../auth/validations/auth-validation";

import { authController, getMeController } from "../auth/auth-controller";
import { errorValidationMiddleware } from "../validation/error-validation-middleware";
import { tokenAuthorizationMiddleware } from "../validation/token-authorization-middleware";

export const authRouter = Router();

authRouter.post(
  "/login",
  loginOrEmailValidation,
  passwordValidation,
  errorValidationMiddleware,
  authController
);

authRouter.get("/me", tokenAuthorizationMiddleware, getMeController);
