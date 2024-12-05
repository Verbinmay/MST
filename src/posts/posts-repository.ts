import { InsertOneResult, ObjectId, WithId } from "mongodb";

import { postsCollection } from "../db/db_mongo";
import { PostInputModel } from "../types/posts/PostInputModel.type";
import { PostViewModel } from "../types/posts/PostViewModel.type";

export const postsRepository = {
  async findPosts(): Promise<Array<WithId<PostViewModel>>> {
    const posts: Array<WithId<PostViewModel>> = await postsCollection
      .find()
      .toArray();
    return posts;
  },

  async createPost(dto: any): Promise<InsertOneResult<PostViewModel>> {
    return await postsCollection.insertOne(dto);
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
