import { viewModelCreator } from "../helpers/viewModelCreator";
import { PaginationInputModel } from "../types/PaginationInputModel.type";
import { UserDBModel } from "../types/users/UserDBModel.type";
import { UserInputModel } from "../types/users/UserInputModel.type";
import { UserPaginationModel } from "../types/users/UserPaginationModel.type";
import { UserViewModel } from "../types/users/UserViewModel.type";
import { usersQueryRepository } from "./users-query-repository";
import { usersService } from "./users-service";

export const usersMapper = {
  async findUsers(pagData: PaginationInputModel): Promise<UserPaginationModel> {
    const usersInfo: {
      totalCount: number;
      users: UserDBModel[];
    } = await usersQueryRepository.findUsers(pagData);

    const usersWithPagination: UserPaginationModel = {
      pagesCount: Math.ceil(usersInfo.totalCount / pagData.pageSize),
      page: pagData.pageNumber,
      pageSize: pagData.pageSize,
      totalCount: usersInfo.totalCount,
      items: usersInfo.users.map((user) =>
        viewModelCreator.userViewModel(user)
      ),
    };
    return usersWithPagination;
  },

  async createUserLikeAdmin(
    dto: UserInputModel
  ): Promise<UserViewModel | null> {
    const user: UserDBModel | null = await usersService.createUserLikeAdmin(
      dto
    );
    return user === null ? null : viewModelCreator.userViewModel(user);
  },

  async deleteUser(id: string): Promise<boolean> {
    const result: boolean = await usersService.deleteUser(id);
    return result;
  },
};
