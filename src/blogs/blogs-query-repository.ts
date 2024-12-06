import { blogsCollection } from "../db/db_mongo";
import { BlogDBModel } from "../types/blogs/BlogDBModel.type";
import { PaginationInputModel } from "../types/PaginationInputModel.type";

export const blogsQueryRepository = {
  async findBlogs(
    pagData: PaginationInputModel
  ): Promise<{ totalCount: number; blogs: BlogDBModel[] }> {
    const filter: any = {
      name: { $regex: pagData.searchNameTerm ?? "", $options: "i" },
    };
    if (Array.isArray(pagData.searchNameTerm)) {
      pagData.searchNameTerm.forEach((term) => {
        new RegExp(term, "i");
      });
      filter.name = { $in: pagData.searchNameTerm, $options: "i" };
    }

    const blogs: Array<BlogDBModel> = await blogsCollection
      .find(filter)
      .sort(pagData.sortBy, pagData.sortDirection)
      .skip((pagData.pageNumber - 1) * pagData.pageSize)
      .limit(pagData.pageSize)
      .toArray();

    const totalCount = await blogsCollection.countDocuments(filter);

    return {
      totalCount,
      blogs,
    };
  },

  async findBlogById(id: string): Promise<BlogDBModel | null> {
    return await blogsCollection.findOne({ id });
  },
};
