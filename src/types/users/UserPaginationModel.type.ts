import { PaginationModel } from "../PaginationModel.type";
import { UserViewModel } from "./UserViewModel.type";

export type UserPaginationModel = PaginationModel & {
  items: Array<UserViewModel>;
};
