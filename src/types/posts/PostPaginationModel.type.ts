import { PaginationModel } from "../PaginationModel.type";
import { PostViewModel } from "./PostViewModel.type";

export type PostPaginationModel = PaginationModel & {
  items: Array<PostViewModel>;
};
