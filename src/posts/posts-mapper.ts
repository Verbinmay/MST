import { WithId } from "mongodb";

import { viewModelCreator } from "../helpers/viewModelCreator";
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
    const post: WithId<PostViewModel> | null = await postsService.createPost(
      dto
    );
    return post ? viewModelCreator.postViewModel(post) : null;
  },

  async findPostById(id: string): Promise<PostViewModel | null> {
    const post: WithId<PostViewModel> | null = await postsQueryRepository.findPostById(
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
};
