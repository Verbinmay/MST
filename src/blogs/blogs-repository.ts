import { db } from "../db/db";
import { BlogViewModel } from "../types/blogs/BlogViewModel.type";

export const blogsRepository = {
  findBlogs(): Array<BlogViewModel> {
    const blogs: Array<BlogViewModel> = db.blogs;
    return blogs;
  },
};
