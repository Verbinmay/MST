import { InsertOneResult, ObjectId } from "mongodb";

import { blogsCollection } from "../db/db_mongo";
import { BlogDBModel } from "../types/blogs/BlogDBModel.type";
import { BlogInputModel } from "../types/blogs/BlogInputModel.type";

export const blogsRepository = {
  async findBlogs(): Promise<BlogDBModel[]> {
    return await blogsCollection.find().toArray();
  },

  async createBlog(dto: any): Promise<InsertOneResult> {
    return await blogsCollection.insertOne(dto);
  },

  async findBlogBy_Id(_id: ObjectId): Promise<BlogDBModel | null> {
    return await blogsCollection.findOne({ _id });
  },

  async findBlogById(id: string): Promise<BlogDBModel | null> {
    return await blogsCollection.findOne({ id });
  },

  async updateBlog(id: string, dto: BlogInputModel): Promise<boolean> {
    const result = await blogsCollection.updateOne(
      { id },
      {
        $set: {
          ...dto,
        },
      }
    );
    return result.matchedCount > 0;
  },

  async deleteBlog(id: string): Promise<boolean> {
    const result = await blogsCollection.deleteOne({ id });
    return result.deletedCount > 0;
  },
};
