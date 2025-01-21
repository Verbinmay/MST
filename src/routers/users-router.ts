import { Router } from "express";
import {
  deleteUserByIdController,
  getUsersController,
  postUserController,
} from "../users/users-controller";
import {
  loginAndEmailUniqueValidation,
  userEmailValidation,
  userLoginValidation,
  userPasswordValidation,
} from "../users/validations/users-validation";

import { basicAuthorizationMiddleware } from "../validation/basic-authorization-middleware";
import { errorValidationMiddleware } from "../validation/error-validation-middleware";
import { inputPaginationMiddleware } from "../validation/input-pagination-middleware";

export const usersRouter = Router();

usersRouter.get(
  "/",
  basicAuthorizationMiddleware,
  inputPaginationMiddleware,
  getUsersController
);

usersRouter.post(
  "/",
  basicAuthorizationMiddleware,
  userLoginValidation,
  userPasswordValidation,
  userEmailValidation,
  errorValidationMiddleware,
  loginAndEmailUniqueValidation,
  postUserController
);

usersRouter.delete(
  "/:id",
  basicAuthorizationMiddleware,
  deleteUserByIdController
);
