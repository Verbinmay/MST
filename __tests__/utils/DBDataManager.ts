import Chance from "chance";

import { db } from "../../src/db/db";
import { BlogInputModel } from "../../src/types/blogs/BlogInputModel.type";
import { BlogViewModel } from "../../src/types/blogs/BlogViewModel.type";
import { PostInputModel } from "../../src/types/posts/PostInputModel.type";
import { PostViewModel } from "../../src/types/posts/PostViewModel.type";

const chance = new Chance();

export const DBDataManager = {
  /** blogs */
  createBlogs(quantity: number): Array<BlogViewModel> {
    db.blogs = [];
    for (let i = 0; i < quantity; i++) {
      db.blogs.push({
        id: chance.string({ length: 10 }),
        createdAt: new Date().toISOString(),
        isMembership: false,
        ...this.createBlogInput(),
      });
    }
    return db.blogs;
  },

  createBlogInput(): BlogInputModel {
    return {
      name: chance.string({ length: 10 }),
      description: chance.letter({ length: 499 }),
      websiteUrl: `https://google.com`,
    };
  },

  createPassword(): string {
    const login = process.env.BASIC_AUTH_LOGIN;
    const password = process.env.BASIC_AUTH_PASSWORD;
    const credentials = login + ":" + password;
    return `Basic ${Buffer.from(credentials).toString("base64")}`;
  },

  createPostInput(blogId?: string): PostInputModel {
    return {
      title: chance.letter({ length: 30 }),
      content: chance.letter({ length: 800 }),
      shortDescription: chance.letter({ length: 10 }),
      blogId: blogId ?? this.createBlogs(1)[0].id,
    };
  },

  createPosts(quantity: number, blogId?: string): Array<PostViewModel> {
    db.posts = [];
    for (let i = 0; i < quantity; i++) {
      const postInput = this.createPostInput(blogId);
      const blog = db.blogs.find((blog) => blog.id === postInput.blogId);
      db.posts.push({
        ...postInput,
        id: chance.string({ length: 10 }),
        createdAt: new Date().toISOString(),
        blogName: blog?.name ?? "",
      });
    }
    return db.posts;
  },
};
