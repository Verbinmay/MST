import { blogsCollection } from "../db/db_mongo";
import { BlogDBModel } from "../types/blogs/BlogDBModel.type";

export const blogsQueryRepository = {
  async findBlogs(): Promise<BlogDBModel[]> {
    return await blogsCollection.find().toArray();
  },

  async findBlogById(id: string): Promise<BlogDBModel | null> {
    return await blogsCollection.findOne({ id });
  },
};
