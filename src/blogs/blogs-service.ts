import { InsertOneResult, WithId } from "mongodb";

import { BlogInputModel } from "../types/blogs/BlogInputModel.type";
import { BlogViewModel } from "../types/blogs/BlogViewModel.type";
import { blogsRepository } from "./blogs-repository";

export const blogsService = {
  async createBlog(dto: BlogInputModel): Promise<WithId<BlogViewModel> | null> {
    const blog: InsertOneResult<BlogViewModel> =
      await blogsRepository.createBlog(dto);
    const findBlog: WithId<BlogViewModel> | null =
      await blogsRepository.findBlogBy_Id(blog.insertedId);
    return findBlog ? findBlog : null;
  },

  async updateBlog(id: string, dto: BlogInputModel): Promise<boolean> {
    return await blogsRepository.updateBlog(id, dto);
  },

    async deleteBlog(id: string): Promise<boolean> {
        return await blogsRepository.deleteBlog(id);
    },
};
