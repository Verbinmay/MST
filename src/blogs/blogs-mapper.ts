import { viewModelCreator } from "../helpers/viewModelCreator";
import { BlogDBModel } from "../types/blogs/BlogDBModel.type";
import { BlogInputModel } from "../types/blogs/BlogInputModel.type";
import { BlogPaginationModel } from "../types/blogs/BlogPaginationModel.type";
import { BlogViewModel } from "../types/blogs/BlogViewModel.type";
import { PaginationInputModel } from "../types/PaginationInputModel.type";
import { blogsQueryRepository } from "./blogs-query-repository";
import { blogsService } from "./blogs-service";

export const blogsMapper = {
  async findBlogs(pagData: PaginationInputModel): Promise<BlogPaginationModel> {
    const blogsInfo: {
      totalCount: number;
      blogs: BlogDBModel[];
    } = await blogsQueryRepository.findBlogs(pagData);

    const blogsWithPagination: BlogPaginationModel = {
      pagesCount: Math.ceil(blogsInfo.totalCount / pagData.pageSize),
      page: pagData.pageNumber,
      pageSize: pagData.pageSize,
      totalCount: blogsInfo.totalCount,
      items: blogsInfo.blogs.map((blog) =>
        viewModelCreator.blogViewModal(blog)
      ),
    };
    return blogsWithPagination;
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
