import { postsCollection } from "../db/db_mongo";
import { PaginationInputModel } from "../types/PaginationInputModel.type";
import { PostDBModel } from "../types/posts/PostDBModel.type";

export const postsQueryRepository = {
  async findPosts(): Promise<Array<PostDBModel>> {
    return await postsCollection.find().toArray();
  },

  async findPostById(id: string): Promise<PostDBModel | null> {
    return await postsCollection.findOne({ id });
  },

  async findPostsByBlogId(
    blogId: string,
    pagData: PaginationInputModel
  ): Promise<{ totalCount: number; posts: PostDBModel[] }> {
    const filter: any = {
      blogId,
      title: { $regex: pagData.searchNameTerm ?? "", $options: "i" },
    };
    if (Array.isArray(pagData.searchNameTerm)) {
      pagData.searchNameTerm.forEach((term) => {
        new RegExp(term, "i");
      });
      filter.title = { $in: pagData.searchNameTerm, $options: "i" };
    }

    const posts: Array<PostDBModel> = await postsCollection
      .find(filter)
      .sort(pagData.sortBy, pagData.sortDirection)
      .skip((pagData.pageNumber - 1) * pagData.pageSize)
      .limit(pagData.pageSize)
      .toArray();

    const totalCount = await postsCollection.countDocuments(filter);

    return {
      totalCount,
      posts,
    };
  },
};
