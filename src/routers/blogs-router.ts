import { Router } from "express";
import {
  getBlogByIdController,
  getBlogsController,
  postBlogsController,
} from "../blogs/blogs-controller";
import {
  blogDescriptionValidation,
  blogNameValidation,
  blogWebsiteUrlValidation,
} from "../blogs/validations/blogs-validation";

import { basicAuthorizationMiddleware } from "../blogs/validations/basic-authorization-middleware";
import { errorValidationMiddleware } from "../blogs/validations/error-validation-middleware";

export const blogsRouter = Router();

blogsRouter.get("/", getBlogsController);
blogsRouter.post(
  "/",
  basicAuthorizationMiddleware,
  blogNameValidation,
  blogDescriptionValidation,
  blogWebsiteUrlValidation,
  errorValidationMiddleware,
  postBlogsController
);
blogsRouter.get("/:id", getBlogByIdController);
