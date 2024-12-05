import { InsertOneResult, ObjectId } from "mongodb";

import { postsCollection } from "../db/db_mongo";
import { PostDBModel } from "../types/posts/PostDBModel.type";
import { PostInputModel } from "../types/posts/PostInputModel.type";

export const postsRepository = {
  async findPosts(): Promise<Array<PostDBModel>> {
    const posts: Array<PostDBModel> = await postsCollection.find().toArray();
    return posts;
  },

  async createPost(dto: any): Promise<InsertOneResult> {
    return await postsCollection.insertOne(dto);
  },

  async findPostBy_Id(_id: ObjectId): Promise<PostDBModel | null> {
    return await postsCollection.findOne({ _id });
  },

  async findPostById(id: string): Promise<PostDBModel | null> {
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
