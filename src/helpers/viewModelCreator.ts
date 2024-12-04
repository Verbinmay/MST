import { WithId } from "mongodb";

import { BlogViewModel } from "../types/blogs/BlogViewModel.type";
import { PostViewModel } from "../types/posts/PostViewModel.type";

export const viewModelCreator = {
  blogViewModal(blog: WithId<BlogViewModel>): BlogViewModel {
    const { _id, ...rest } = blog;
    return rest;
  },
  postViewModel(post: WithId<PostViewModel>): PostViewModel {
    const { _id, ...rest } = post;
    return rest;
  },
};
