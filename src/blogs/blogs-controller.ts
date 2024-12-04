import { Request, Response } from "express";
import { matchedData } from "express-validator";
import { InsertOneResult, WithId } from "mongodb";

import { viewModelCreator } from "../helpers/viewModelCreator";
import { BlogInputModel } from "../types/blogs/BlogInputModel.type";
import { BlogViewModel } from "../types/blogs/BlogViewModel.type";
import { blogsRepository } from "./blogs-repository";

export const getBlogsController = async (req: Request, res: Response) => {
  const blogs: Array<WithId<BlogViewModel>> = await blogsRepository.findBlogs();
  const mappedBlogsToViewModel: Array<BlogViewModel> = blogs.map((blog) =>
    viewModelCreator.blogViewModal(blog)
  );
  res.status(200).send(mappedBlogsToViewModel);
};

export const postBlogsController = async (req: Request, res: Response) => {
  const data = matchedData(req);
  const blog: InsertOneResult<BlogViewModel> = await blogsRepository.createBlog(
    data as BlogViewModel
  );
  const findBlog: WithId<BlogViewModel> | null =
    await blogsRepository.findBlogBy_Id(blog.insertedId);
  res
    .status(201)
    .send(findBlog ? viewModelCreator.blogViewModal(findBlog) : null);
};

export const getBlogByIdController = async (req: Request, res: Response) => {
  const id = req.params.id;
  const blog: WithId<BlogViewModel> | null = await blogsRepository.findBlogById(
    id
  );
  blog
    ? res.status(200).send(viewModelCreator.blogViewModal(blog))
    : res.sendStatus(404);
};

export const putBlogByIdController = async (req: Request, res: Response) => {
  const id = req.params.id;
  const data = matchedData(req);
  const updatedBlog: boolean = await blogsRepository.updateBlog(
    id,
    data as BlogInputModel
  );
  updatedBlog ? res.sendStatus(204) : res.sendStatus(404);
};

export const deleteBlogByIdController = async (req: Request, res: Response) => {
  const id = req.params.id;
  const isDeleted: boolean = await blogsRepository.deleteBlog(id);
  isDeleted ? res.sendStatus(204) : res.sendStatus(404);
};
