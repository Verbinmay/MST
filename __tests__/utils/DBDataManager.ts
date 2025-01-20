import Chance from "chance";
import { InsertOneResult } from "mongodb";
import {
  blogsCollection,
  client,
  postsCollection,
} from "../../src/db/db_mongo";

import { faker } from "@faker-js/faker/.";

import { blogsRepository } from "../../src/blogs/blogs-repository";
import { viewModelCreator } from "../../src/helpers/viewModelCreator";
import { postsRepository } from "../../src/posts/posts-repository";
import { BlogDBModel } from "../../src/types/blogs/BlogDBModel.type";
import { BlogInputModel } from "../../src/types/blogs/BlogInputModel.type";
import { BlogViewModel } from "../../src/types/blogs/BlogViewModel.type";
import { PostDBModel } from "../../src/types/posts/PostDBModel.type";
import { PostInputModel } from "../../src/types/posts/PostInputModel.type";
import { PostViewModel } from "../../src/types/posts/PostViewModel.type";
import { UserDBModel } from "../../src/types/users/UserDBModel.type";
import { UserInputModel } from "../../src/types/users/UserInputModel.type";
import { UserViewModel } from "../../src/types/users/UserViewModel.type";
import { usersService } from "../../src/users/users-service";

const chance = new Chance();

export const DBDataManager = {
  /** db */
  async deleteAllDb(): Promise<void> {
    await blogsCollection.deleteMany({});
    await postsCollection.deleteMany({});
  },
  async closeConnection() {
    await client.close();
  },
  /** blogs */
  async createBlogs(
    quantity: number,
    viewModel: boolean = false
  ): Promise<BlogDBModel[] | Array<BlogViewModel>> {
    const blogs: Array<BlogDBModel> = [];
    for (let i = 0; i < quantity; i++) {
      const blog: InsertOneResult = await blogsRepository.createBlog(
        this.createBlogInput() as BlogViewModel
      );
      const findBlog: BlogDBModel | null = await blogsRepository.findBlogBy_Id(
        blog.insertedId
      );
      if (findBlog) {
        blogs.push(findBlog);
      }
    }
    return viewModel
      ? blogs.map((blog) => viewModelCreator.blogViewModal(blog))
      : blogs;
  },
  createBlogInput(): BlogInputModel {
    return {
      name: chance.string({ length: 10 }),
      description: chance.letter({ length: 499 }),
      websiteUrl: `https://google.com`,
    };
  },

  async findBlogById(
    id: string,
    viewModel: boolean = false
  ): Promise<BlogDBModel | null | BlogViewModel> {
    const blog = await blogsRepository.findBlogById(id);

    if (!blog) {
      return null;
    }

    if (viewModel) {
      return viewModelCreator.blogViewModal(blog);
    }

    return blog;
  },

  /** password */
  createPassword(): string {
    const login = process.env.BASIC_AUTH_LOGIN;
    const password = process.env.BASIC_AUTH_PASSWORD;
    const credentials = login + ":" + password;
    return `Basic ${Buffer.from(credentials).toString("base64")}`;
  },

  /** posts */
  async createPostInput(blogId?: string): Promise<PostInputModel> {
    return {
      title: chance.letter({ length: 30 }),
      content: chance.letter({ length: 800 }),
      shortDescription: chance.letter({ length: 10 }),
      blogId: blogId ?? (await this.createBlogs(1))[0].id,
    };
  },

  async createPosts(
    quantity: number,
    blogId?: string,
    viewModel: boolean = false
  ): Promise<Array<PostViewModel | PostDBModel>> {
    const posts: Array<PostDBModel> = [];
    for (let i = 0; i < quantity; i++) {
      const postInput: PostInputModel = await this.createPostInput(blogId);
      const post: InsertOneResult = await postsRepository.createPost(postInput);
      const findPost: PostDBModel | null = await postsRepository.findPostBy_Id(
        post.insertedId
      );
      if (findPost !== null) {
        posts.push(findPost);
      }
    }
    return viewModel
      ? posts.map((post) => viewModelCreator.postViewModel(post))
      : posts;
  },

  async findPostById(
    id: string,
    viewModel: boolean = false
  ): Promise<PostDBModel | null | PostViewModel> {
    const post = await postsRepository.findPostById(id);

    if (!post) {
      return null;
    }

    if (viewModel) {
      return viewModelCreator.postViewModel(post);
    }

    return post;
  },

  /** users */
  async createUserInput(): Promise<UserInputModel> {
    return {
      login: faker.internet.username(),
      email: chance.email(),
      password: faker.internet.password(),
    };
  },

  async createUsers(
    quantity: number,
    viewModel: boolean = false
  ): Promise<Array<{ user: UserDBModel | UserViewModel; pass: string }>> {
    const users: Array<{ user: UserDBModel | UserViewModel; pass: string }> =
      [];
    for (let i = 0; i < quantity; i++) {
      const userInfo: UserInputModel = await this.createUserInput();

      const user: UserDBModel | null = await usersService.createUser(userInfo);

      if (user !== null) {
        users.push({
          user: viewModel ? viewModelCreator.userViewModel(user) : user,
          pass: userInfo.password,
        });
      }
    }
    return users;
  },
};
