import { WithId } from "mongodb";

import { blogsCollection } from "../db/db_mongo";
import { BlogViewModel } from "../types/blogs/BlogViewModel.type";

export const blogsQueryRepository = {
  async findBlogs(): Promise<WithId<BlogViewModel>[]> {
    return await blogsCollection.find().toArray();
  },

  async findBlogById(id: string): Promise<WithId<BlogViewModel> | null> {
    return await blogsCollection.findOne({ id });
  },
};
