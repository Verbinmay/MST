import { Router } from "express";
import {
  authController,
  getMeController,
  logoutController,
  refreshTokensController,
  registrationConfirmationController,
  registrationController,
} from "../auth/auth-controller";
import {
  codeValidation,
  loginOrEmailValidation,
  passwordValidation,
} from "../auth/validations/auth-validation";
import {
  loginAndEmailUniqueValidation,
  userEmailValidation,
  userLoginValidation,
  userPasswordValidation,
} from "../users/validations/users-validation";

import { countOfRequestsMiddleware } from "../validation/count-of-requests-middleware";
import { errorValidationMiddleware } from "../validation/error-validation-middleware";
import { tokenAuthorizationMiddleware } from "../validation/token-authorization-middleware";

export const authRouter = Router();

authRouter.post(
  "/login",
  loginOrEmailValidation,
  passwordValidation,
  errorValidationMiddleware,
  countOfRequestsMiddleware,
  authController
);

authRouter.get("/me", tokenAuthorizationMiddleware, getMeController);

authRouter.post(
  "/registration",
  userLoginValidation,
  userPasswordValidation,
  userEmailValidation,
  errorValidationMiddleware,
  loginAndEmailUniqueValidation,
  countOfRequestsMiddleware,
  registrationController
);

authRouter.post(
  "/registration-confirmation",
  codeValidation,
  errorValidationMiddleware,
  registrationConfirmationController
);

authRouter.post("/refresh-token", refreshTokensController);

authRouter.post("/logout", logoutController);
