import { Request, Response } from "express";
import { matchedData } from "express-validator";

import { postsMapper } from "../posts/posts-mapper";
import { BlogInputModel } from "../types/blogs/BlogInputModel.type";
import { BlogPaginationModel } from "../types/blogs/BlogPaginationModel.type";
import { BlogViewModel } from "../types/blogs/BlogViewModel.type";
import { PaginationInputModel } from "../types/PaginationInputModel.type";
import { PostPaginationModel } from "../types/posts/PostPaginationModel.type";
import { blogsMapper } from "./blogs-mapper";

export const getBlogsController = async (req: Request, res: Response) => {
  const pagData: PaginationInputModel = req.body._pagination;
  const blogs: BlogPaginationModel = await blogsMapper.findBlogs(pagData);
  res.status(200).send(blogs);
};

export const postBlogsController = async (req: Request, res: Response) => {
  const data = matchedData(req);
  const blog: BlogViewModel | null = await blogsMapper.createBlog(
    data as BlogInputModel
  );
  blog ? res.status(201).send(blog) : res.sendStatus(400);
};

export const getBlogByIdController = async (req: Request, res: Response) => {
  const id = req.params.id;
  const blog: BlogViewModel | null = await blogsMapper.findBlogById(id);
  blog ? res.status(200).send(blog) : res.sendStatus(404);
};

export const putBlogByIdController = async (req: Request, res: Response) => {
  const id = req.params.id;
  const data = matchedData(req);
  const updatedBlog: boolean = await blogsMapper.updateBlog(
    id,
    data as BlogInputModel
  );
  updatedBlog ? res.sendStatus(204) : res.sendStatus(404);
};

export const deleteBlogByIdController = async (req: Request, res: Response) => {
  const id = req.params.id;
  const isDeleted: boolean = await blogsMapper.deleteBlog(id);
  isDeleted ? res.sendStatus(204) : res.sendStatus(404);
};

export const getPostsByBlogIdController = async (
  req: Request,
  res: Response
) => {
  const blogId = req.params.id;
  const pagData: PaginationInputModel = req.body._pagination;
  const posts: PostPaginationModel = await postsMapper.findPostsByBlogId(
    blogId,
    pagData
  );
  res.status(200).send(posts);
};
