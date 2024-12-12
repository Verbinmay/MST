import { BlogDBModel } from "../types/blogs/BlogDBModel.type";
import { BlogViewModel } from "../types/blogs/BlogViewModel.type";
import { PostDBModel } from "../types/posts/PostDBModel.type";
import { PostViewModel } from "../types/posts/PostViewModel.type";
import { UserDBModel } from "../types/users/UserDBModel.type";
import { UserViewModel } from "../types/users/UserViewModel.type";

export const viewModelCreator = {
  blogViewModal(blog: BlogDBModel): BlogViewModel {
    const { _id, ...rest } = blog;
    return rest;
  },
  postViewModel(post: PostDBModel): PostViewModel {
    const { _id, ...rest } = post;
    return rest;
  },
  userViewModel(user: UserDBModel): UserViewModel {
    return {
      login: user.login,
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
    };
  },
};
