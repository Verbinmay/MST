import { BlogViewModel } from "../types/blogs/BlogViewModel.type";
import { PostViewModel } from "../types/posts/PostViewModel.type";

export type DBType = {
  blogs: Array<BlogViewModel>;
  posts: Array<PostViewModel>;
};

export const db: DBType = {
  blogs: [],
  posts: [],
};

export const setDB = (dataset?: Partial<DBType>) => {
  if (!dataset) {
    db.blogs = [];
    db.posts = [];
    return;
  }

  db.blogs = dataset.blogs || db.blogs;
  db.posts = dataset.posts || db.posts;
};
