import { Router } from "express";

import { getBlogsController, postBlogsController } from "../blogs/blogs-controller";

export const blogsRouter = Router();

blogsRouter.get("/", getBlogsController);
blogsRouter.post("/", postBlogsController);
