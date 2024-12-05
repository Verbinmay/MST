import { randomUUID } from "crypto";
import { InsertOneResult } from "mongodb";

import { BlogDBModel } from "../types/blogs/BlogDBModel.type";
import { BlogInputModel } from "../types/blogs/BlogInputModel.type";
import { BlogViewModel } from "../types/blogs/BlogViewModel.type";
import { blogsRepository } from "./blogs-repository";

export const blogsService = {
  async createBlog(dto: BlogInputModel): Promise<BlogDBModel | null> {
    const blogDto: BlogViewModel = {
      ...dto,
      id: randomUUID(),
      createdAt: new Date().toISOString(),
      isMembership: false,
    };
    const blog: InsertOneResult = await blogsRepository.createBlog(blogDto);
    const findBlog: BlogDBModel | null = await blogsRepository.findBlogBy_Id(
      blog.insertedId
    );
    return findBlog ? findBlog : null;
  },

  async updateBlog(id: string, dto: BlogInputModel): Promise<boolean> {
    return await blogsRepository.updateBlog(id, dto);
  },

  async deleteBlog(id: string): Promise<boolean> {
    return await blogsRepository.deleteBlog(id);
  },
};
