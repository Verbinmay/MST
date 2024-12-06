import { PaginationModel } from "../PaginationModel.type";
import { BlogViewModel } from "./BlogViewModel.type";

export type BlogPaginationModel = PaginationModel & {
  items: Array<BlogViewModel>;
};
