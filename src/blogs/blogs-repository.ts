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

  findBlogById(id: string): BlogViewModel | null {
    return db.blogs.find((blog) => blog.id === id) ?? null;
  },

  updateBlog(id: string, dto: BlogInputModel): BlogViewModel | null {
    let updatedBlog = null;
    db.blogs = db.blogs.map((blog) => {
      if (blog.id === id) {
        updatedBlog = { ...blog, ...dto };
        return updatedBlog;
      }
      return blog;
    });
    return updatedBlog;
  },
};
