import { BlogViewModel } from "../types/blogs/BlogViewModel.type";
import { PostViewModel } from "../types/posts/PostViewModel.type";
import { VideoType } from "../types/videos/Video.type";

export type DBType = {
  videos: Array<VideoType>;
  blogs: Array<BlogViewModel>;
  posts: Array<PostViewModel>;
};

export const db: DBType = {
  videos: [],
  blogs: [],
  posts: [],
};

export const setDB = (dataset?: Partial<DBType>) => {
  if (!dataset) {
    db.videos = [];
    db.blogs = [];
    db.posts = [];
    return;
  }

  db.videos = dataset.videos || db.videos;
  db.blogs = dataset.blogs || db.blogs;
  db.posts = dataset.posts || db.posts;
};
