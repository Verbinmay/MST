import { randomUUID } from "crypto";
import { InsertOneResult, ObjectId, WithId } from "mongodb";

import { blogsCollection } from "../db/db_mongo";
import { BlogInputModel } from "../types/blogs/BlogInputModel.type";
import { BlogViewModel } from "../types/blogs/BlogViewModel.type";

export const blogsRepository = {
  async findBlogs(): Promise<WithId<BlogViewModel>[]> {
    return await blogsCollection.find().toArray();
  },

  async createBlog(
    dto: BlogInputModel
  ): Promise<InsertOneResult<BlogViewModel>> {
    const blog: BlogViewModel = {
      ...dto,
      id: randomUUID(),
      createdAt: new Date().toISOString(),
      isMembership: false,
    };
    return await blogsCollection.insertOne(blog);
  },

  async findBlogBy_Id(_id: ObjectId): Promise<WithId<BlogViewModel> | null> {
    return await blogsCollection.findOne({ _id });
  },

  async findBlogById(id: string): Promise<WithId<BlogViewModel> | null> {
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
