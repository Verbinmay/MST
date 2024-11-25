import { Request, Response } from "express";

import { BlogViewModel } from "../types/blogs/BlogViewModel.type";
import { blogsRepository } from "./blogs-repository";

export const getBlogsController = (req: Request, res: Response) => {
  const blogs: Array<BlogViewModel> = blogsRepository.findBlogs();
  res.status(200).send(blogs);
};
export const postBlogsController = (req: Request, res: Response) => {
  const blog: BlogViewModel = blogsRepository.createBlog(req.body);
  res.status(201).send(blog);
};
