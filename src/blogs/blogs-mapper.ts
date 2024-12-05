import { viewModelCreator } from "../helpers/viewModelCreator";
import { BlogDBModel } from "../types/blogs/BlogDBModel.type";
import { BlogInputModel } from "../types/blogs/BlogInputModel.type";
import { BlogViewModel } from "../types/blogs/BlogViewModel.type";
import { blogsQueryRepository } from "./blogs-query-repository";
import { blogsService } from "./blogs-service";

export const blogsMapper = {
  async findBlogs(): Promise<Array<BlogViewModel>> {
    const blogs: Array<BlogDBModel> = await blogsQueryRepository.findBlogs();
    const mappedBlogsToViewModel: Array<BlogViewModel> = blogs.map((blog) =>
      viewModelCreator.blogViewModal(blog)
    );
    return mappedBlogsToViewModel;
  },

  async createBlog(dto: BlogInputModel): Promise<BlogViewModel | null> {
    const blog: BlogDBModel | null = await blogsService.createBlog(dto);
    return blog ? viewModelCreator.blogViewModal(blog) : null;
  },

  async findBlogById(id: string): Promise<BlogViewModel | null> {
    const blog: BlogDBModel | null = await blogsQueryRepository.findBlogById(
      id
    );
    return blog ? viewModelCreator.blogViewModal(blog) : null;
  },

  async updateBlog(id: string, dto: BlogInputModel): Promise<boolean> {
    return await blogsService.updateBlog(id, dto);
  },

  async deleteBlog(id: string): Promise<boolean> {
    return await blogsService.deleteBlog(id);
  },
};
