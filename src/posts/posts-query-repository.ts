import { WithId } from "mongodb";

import { postsCollection } from "../db/db_mongo";
import { PostViewModel } from "../types/posts/PostViewModel.type";

export const postsQueryRepository = {
  async findPosts(): Promise<Array<WithId<PostViewModel>>> {
    return await postsCollection.find().toArray();
  },

  async findPostById(id: string): Promise<WithId<PostViewModel> | null> {
    return await postsCollection.findOne({ id });
  },
};
