import { randomUUID } from "crypto";
import { InsertOneResult, ObjectId, WithId } from "mongodb";

import { blogsCollection, postsCollection } from "../db/db_mongo";
import { BlogViewModel } from "../types/blogs/BlogViewModel.type";
import { PostInputModel } from "../types/posts/PostInputModel.type";
import { PostViewModel } from "../types/posts/PostViewModel.type";

export const postsRepository = {
  async findPosts(): Promise<Array<WithId<PostViewModel>>> {
    const posts: Array<WithId<PostViewModel>> = await postsCollection.find().toArray()
    return posts;
  },

  async createPost(
    dto: PostInputModel
  ): Promise<InsertOneResult<PostViewModel>> {
    const blog: BlogViewModel | null = await blogsCollection.findOne({
      id: dto.blogId,
    });
    if (!blog) {
      throw new Error("Blog not found");
    }
    const post: PostViewModel = {
      ...dto,
      id: randomUUID(),
      blogName: blog.name,
      createdAt: new Date().toISOString(),
    };
    return await postsCollection.insertOne(post);
  },

  async findPostBy_Id(_id: ObjectId): Promise<WithId<PostViewModel> | null> {
    return await postsCollection.findOne({ _id });
  },

  async findPostById(id: string): Promise<WithId<PostViewModel> | null> {
    return await postsCollection.findOne({ id });
  },

  async updatePost(id: string, dto: PostInputModel): Promise<boolean> {
    const result = await postsCollection.updateOne(
      { id },
      {
        $set: {
          ...dto,
        },
      }
    );
    return result.matchedCount > 0;
  },

  async deletePost(id: string): Promise<boolean> {
    const result = await postsCollection.deleteOne({ id });
    return result.deletedCount > 0;
  },
};
