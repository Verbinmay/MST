import { postsCollection } from "../db/db_mongo";
import { PostDBModel } from "../types/posts/PostDBModel.type";

export const postsQueryRepository = {
  async findPosts(): Promise<Array<PostDBModel>> {
    return await postsCollection.find().toArray();
  },

  async findPostById(id: string): Promise<PostDBModel | null> {
    return await postsCollection.findOne({ id });
  },
};
