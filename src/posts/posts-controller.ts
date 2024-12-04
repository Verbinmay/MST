import { Request, Response } from "express";
import { matchedData } from "express-validator";
import { InsertOneResult, WithId } from "mongodb";

import { viewModelCreator } from "../helpers/viewModelCreator";
import { PostViewModel } from "../types/posts/PostViewModel.type";
import { postsRepository } from "./posts-repository";

export const getPostsController = async (req: Request, res: Response) => {
  const posts: Array<WithId<PostViewModel>> = await postsRepository.findPosts();
  const mappedPostsToViewModel = posts.map((post) => {
    return viewModelCreator.postViewModel(post);
  });
  res.status(200).send(mappedPostsToViewModel);
};

export const postPostController = async (req: Request, res: Response) => {
  const data = matchedData(req);
  const post: InsertOneResult<PostViewModel> = await postsRepository.createPost(
    data as PostViewModel
  );

  const findPost: WithId<PostViewModel> | null =
    await postsRepository.findPostBy_Id(post.insertedId);
  res
    .status(201)
    .send(findPost ? viewModelCreator.postViewModel(findPost) : null);
};

export const getPostByIdController = async (req: Request, res: Response) => {
  const id = req.params.id;
  const post: WithId<PostViewModel> | null = await postsRepository.findPostById(
    id
  );
  post
    ? res.status(200).send(viewModelCreator.postViewModel(post))
    : res.sendStatus(404);
};

export const putPostByIdController = async (req: Request, res: Response) => {
  const id = req.params.id;
  const data = matchedData(req);
  const updatedPost: boolean = await postsRepository.updatePost(
    id,
    data as PostViewModel
  );
  updatedPost ? res.sendStatus(204) : res.sendStatus(404);
};

export const deletePostByIdController = async (req: Request, res: Response) => {
  const id = req.params.id;
  const isDeleted: boolean = await postsRepository.deletePost(id);
  isDeleted ? res.sendStatus(204) : res.sendStatus(404);
};
