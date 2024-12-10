import { Router } from "express";
import {
  deletePostByIdController,
  getPostByIdController,
  getPostsController,
  postPostController,
  putPostByIdController,
} from "../posts/posts-controller";
import {
  postBlogIdValidation,
  postContentValidation,
  postShortDescriptionValidation,
  postTitleValidation,
} from "../posts/validations/posts-validation";

import { basicAuthorizationMiddleware } from "../validation/basic-authorization-middleware";
import { errorValidationMiddleware } from "../validation/error-validation-middleware";

export const postsRouter = Router();

postsRouter.get("/", getPostsController);
postsRouter.post(
  "/",
  basicAuthorizationMiddleware,
  postTitleValidation,
  postShortDescriptionValidation,
  postContentValidation,
  postBlogIdValidation("body"),
  errorValidationMiddleware,
  postPostController
);
postsRouter.get("/:id", getPostByIdController);
postsRouter.put(
  "/:id",
  basicAuthorizationMiddleware,
  postTitleValidation,
  postShortDescriptionValidation,
  postContentValidation,
  postBlogIdValidation("body"),
  errorValidationMiddleware,
  putPostByIdController
);
postsRouter.delete(
  "/:id",
  basicAuthorizationMiddleware,
  deletePostByIdController
);
