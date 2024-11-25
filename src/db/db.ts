import { BlogViewModel } from "../types/blogs/BlogViewModel.type";
import { VideoType } from "../types/videos/Video.type";

export type DBType = {
  videos: Array<VideoType>;
  blogs: Array<BlogViewModel>;
};

export const db: DBType = {
  videos: [],
  blogs: [],
};

export const setDB = (dataset?: Partial<DBType>) => {
  if (!dataset) {
    db.videos = [];
    db.blogs = [];
    return;
  }

  db.videos = dataset.videos || db.videos;
  db.blogs = dataset.blogs || db.blogs;
};
