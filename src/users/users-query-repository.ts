import { usersCollection } from "../db/db_mongo";
import { PaginationInputModel } from "../types/PaginationInputModel.type";
import { UserDBModel } from "../types/users/UserDBModel.type";

export const usersQueryRepository = {
  async findUsers(
    pagData: PaginationInputModel
  ): Promise<{ totalCount: number; users: UserDBModel[] }> {
    let filter: any = {};
    if (typeof pagData.searchLoginTerm === "string") {
      filter.login = { $regex: pagData.searchLoginTerm, $options: "i" };
    }
    if (typeof pagData.searchEmailTerm === "string") {
      filter.email = { $regex: pagData.searchEmailTerm, $options: "i" };
    }

    const users: Array<UserDBModel> = await usersCollection
      .find(filter)
      .sort(pagData.sortBy, pagData.sortDirection)
      .skip((pagData.pageNumber - 1) * pagData.pageSize)
      .limit(pagData.pageSize)
      .toArray();

    const totalCount = await usersCollection.countDocuments(filter);

    return {
      totalCount,
      users,
    };
  },
};
