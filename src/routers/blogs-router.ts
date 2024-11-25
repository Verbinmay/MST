import { Router } from "express";
import {
  getBlogsController,
  postBlogsController,
} from "../blogs/blogs-controller";
import {
  blogDescriptionValidation,
  blogNameValidation,
  blogWebsiteUrlValidation,
} from "../blogs/validations/blogs-validation";

import { errorValidationMiddleware } from "../blogs/validations/error-validation-middleware";

export const blogsRouter = Router();

blogsRouter.get("/", getBlogsController);
blogsRouter.post(
  "/",
  blogNameValidation,
  blogDescriptionValidation,
  blogWebsiteUrlValidation,
  errorValidationMiddleware,
  postBlogsController
);
