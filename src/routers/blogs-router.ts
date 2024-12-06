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

import { basicAuthorizationMiddleware } from "../validation/basic-authorization-middleware";
import { errorValidationMiddleware } from "../validation/error-validation-middleware";
import { inputPaginationMiddleware } from "../validation/input-pagination-middleware";

export const blogsRouter = Router();

blogsRouter.get("/", inputPaginationMiddleware, getBlogsController);
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
