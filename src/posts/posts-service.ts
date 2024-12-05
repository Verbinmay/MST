import { randomUUID } from "crypto";
import { InsertOneResult, WithId } from "mongodb";

import { blogsRepository } from "../blogs/blogs-repository";
import { BlogViewModel } from "../types/blogs/BlogViewModel.type";
import { PostInputModel } from "../types/posts/PostInputModel.type";
import { PostViewModel } from "../types/posts/PostViewModel.type";
import { postsRepository } from "./posts-repository";

export const postsService = {
  async createPost(dto: PostInputModel): Promise<WithId<PostViewModel> | null> {
    const blog: WithId<BlogViewModel> | null =
      await blogsRepository.findBlogById(dto.blogId);

    if (!blog) {
      throw new Error("Blog not found");
    }

    const postDto = {
      ...dto,
      id: randomUUID(),
      blogName: blog.name,
      createdAt: new Date().toISOString(),
    };

    const post: InsertOneResult<PostViewModel> =
      await postsRepository.createPost(postDto);

    const createdPost: WithId<PostViewModel> | null =
      await postsRepository.findPostBy_Id(post.insertedId);
    return createdPost;
  },

  async updatePost(id: string, dto: PostInputModel): Promise<boolean> {
    const isUpdated: boolean = await postsRepository.updatePost(id, dto);
    return isUpdated;
  },

  async deletePost(id: string): Promise<boolean> {
    const isDeleted: boolean = await postsRepository.deletePost(id);
    return isDeleted;
  },
};
