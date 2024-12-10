import { Router } from "express";
import {
  deleteBlogByIdController,
  getBlogByIdController,
  getBlogsController,
  getPostsByBlogIdController,
  postBlogsController,
  putBlogByIdController,
} from "../blogs/blogs-controller";
import {
  blogDescriptionValidation,
  blogNameValidation,
  blogWebsiteUrlValidation,
} from "../blogs/validations/blogs-validation";
import {
  postBlogIdValidation,
  postContentValidation,
  postShortDescriptionValidation,
  postTitleValidation,
} from "../posts/validations/posts-validation";

import { basicAuthorizationMiddleware } from "../validation/basic-authorization-middleware";
import { errorValidationMiddleware } from "../validation/error-validation-middleware";
import { inputPaginationMiddleware } from "../validation/input-pagination-middleware";
import { queryBlogIdTransferMiddleware } from "../validation/query-blogid-transfer-middleware";

export const blogsRouter = Router();

blogsRouter.get("/", inputPaginationMiddleware, getBlogsController);
blogsRouter.get("/:id", getBlogByIdController);
blogsRouter.get(
  "/:id/posts",
  inputPaginationMiddleware,
  getPostsByBlogIdController
);
blogsRouter.post(
  "/",
  basicAuthorizationMiddleware,
  blogNameValidation,
  blogDescriptionValidation,
  blogWebsiteUrlValidation,
  errorValidationMiddleware,
  postBlogsController
);
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

blogsRouter.post(
  "/:id/posts",
  basicAuthorizationMiddleware,
  postTitleValidation,
  postShortDescriptionValidation,
  postContentValidation,
  postBlogIdValidation("query"),
  errorValidationMiddleware,
  queryBlogIdTransferMiddleware,
  postBlogsController
);
