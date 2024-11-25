import { Router } from "express";

import { getBlogsController } from "../blogs/blogs-controller";

export const blogsRouter = Router();

blogsRouter.get("/", getBlogsController);
