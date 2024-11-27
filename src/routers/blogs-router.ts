import { Router } from "express";
import {
  deleteBlogByIdController,
  getBlogByIdController,
  getBlogsController,
  postBlogsController,
  putBlogByIdController,
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
blogsRouter.put(
  "/:id",
  basicAuthorizationMiddleware,
  blogNameValidation,
  blogDescriptionValidation,
  blogWebsiteUrlValidation,
  errorValidationMiddleware,
  putBlogByIdController
);
blogsRouter.delete(
  "/:id",
  basicAuthorizationMiddleware,
  deleteBlogByIdController
);
