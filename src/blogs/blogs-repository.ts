import { db } from "../db/db";
import { BlogInputModel } from "../types/blogs/BlogInputModel.type";
import { BlogViewModel } from "../types/blogs/BlogViewModel.type";

export const blogsRepository = {
  findBlogs(): Array<BlogViewModel> {
    const blogs: Array<BlogViewModel> = db.blogs;
    return blogs;
  },

  createBlog(dto: BlogInputModel): BlogViewModel {
    const blog: BlogViewModel = {
      ...dto,
      id: ` ${db.blogs.length + 1}`,
    };
    db.blogs.push(blog);
    return blog;
  },
};
