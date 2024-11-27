import { db } from "../db/db";
import { BlogViewModel } from "../types/blogs/BlogViewModel.type";
import { PostInputModel } from "../types/posts/PostInputModel.type";
import { PostViewModel } from "../types/posts/PostViewModel.type";

export const postsRepository = {
  findPosts(): Array<PostViewModel> {
    const posts: Array<PostViewModel> = db.posts;
    return posts;
  },

  createPost(dto: PostInputModel): PostViewModel {
    const blog: BlogViewModel | undefined = db.blogs.find(
      (blog) => blog.id === dto.blogId
    );
    if (!blog) {
      throw new Error("Blog not found");
    }
    const post: PostViewModel = {
      ...dto,
      id: ` ${db.posts.length + 1}`,
      blogName: blog.name,
    };
    db.posts.push(post);
    return post;
  },

  findPostById(id: string): PostViewModel | null {
    return db.posts.find((post) => post.id === id) ?? null;
  },

  updatePost(id: string, dto: PostInputModel): PostViewModel | null {
    let updatedPost = null;
    db.posts = db.posts.map((post) => {
      if (post.id === id) {
        updatedPost = { ...post, ...dto };
        return updatedPost;
      }
      return post;
    });
    return updatedPost;
  },

  deletePost(id: string): boolean {
    const initialLength = db.posts.length;
    db.posts = db.posts.filter((post) => post.id !== id);
    return db.posts.length < initialLength;
  },
};
