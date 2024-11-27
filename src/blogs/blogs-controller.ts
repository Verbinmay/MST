import { Request, Response } from "express";
import { matchedData } from "express-validator";

import { BlogViewModel } from "../types/blogs/BlogViewModel.type";
import { blogsRepository } from "./blogs-repository";

export const getBlogsController = (req: Request, res: Response) => {
  const blogs: Array<BlogViewModel> = blogsRepository.findBlogs();
  res.status(200).send(blogs);
};

export const postBlogsController = (req: Request, res: Response) => {
  const data = matchedData(req);
  const blog: BlogViewModel = blogsRepository.createBlog(data as BlogViewModel);
  res.status(201).send(blog);
};

export const getBlogByIdController = (req: Request, res: Response) => {
  const id = req.params.id;
  const blog: BlogViewModel | null = blogsRepository.findBlogById(id);
  blog ? res.status(200).send(blog) : res.sendStatus(404);
};

export const putBlogByIdController = (req: Request, res: Response) => {
  const id = req.params.id;
  const data = matchedData(req);
  const updatedBlog = blogsRepository.updateBlog(id, data as BlogViewModel);
  updatedBlog ? res.sendStatus(204) : res.sendStatus(404);
};

export const deleteBlogByIdController = (req: Request, res: Response) => {
  const id = req.params.id;
  const isDeleted = blogsRepository.deleteBlog(id);
  isDeleted ? res.sendStatus(204) : res.sendStatus(404);
}