import { viewModelCreator } from "../helpers/viewModelCreator";
import { PaginationInputModel } from "../types/PaginationInputModel.type";
import { PostDBModel } from "../types/posts/PostDBModel.type";
import { PostPaginationModel } from "../types/posts/PostPaginationModel.type";
import { PostViewModel } from "../types/posts/PostViewModel.type";
import { postsQueryRepository } from "./posts-query-repository";
import { postsService } from "./posts-service";

export const postsMapper = {
  async findPosts(): Promise<Array<PostViewModel>> {
    const posts = await postsQueryRepository.findPosts();
    return posts.map((post) => {
      return viewModelCreator.postViewModel(post);
    });
  },

  async createPost(dto: PostViewModel): Promise<PostViewModel | null> {
    const post: PostDBModel | null = await postsService.createPost(dto);
    return post ? viewModelCreator.postViewModel(post) : null;
  },

  async findPostById(id: string): Promise<PostViewModel | null> {
    const post: PostDBModel | null = await postsQueryRepository.findPostById(
      id
    );
    return post ? viewModelCreator.postViewModel(post) : null;
  },

  async updatePost(id: string, dto: PostViewModel): Promise<boolean> {
    return await postsService.updatePost(id, dto);
  },

  async deletePost(id: string): Promise<boolean> {
    return await postsService.deletePost(id);
  },

  async findPostsByBlogId(
    blogId: string,
    pagData: PaginationInputModel
  ){

    const postsInfo: {
      totalCount: number;
      posts: PostDBModel[];
    } = await postsQueryRepository.findPostsByBlogId(blogId, pagData);

    const postsWithPagination: PostPaginationModel = {
      pagesCount: Math.ceil(postsInfo.totalCount / pagData.pageSize),
      page: pagData.pageNumber,
      pageSize: pagData.pageSize,
      totalCount: postsInfo.totalCount,
      items: postsInfo.posts.map((post) =>
        viewModelCreator.postViewModel(post)
      ),
    };
    return postsWithPagination;
  }
};
