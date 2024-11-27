import { Request, Response } from "express";
import { matchedData } from "express-validator";

import { PostViewModel } from "../types/posts/PostViewModel.type";
import { postsRepository } from "./posts-repository";

export const getPostsController = (req: Request, res: Response) => {
  const posts: Array<PostViewModel> = postsRepository.findPosts();
  res.status(200).send(posts);
};

export const postPostController = (req: Request, res: Response) => {
  const data = matchedData(req);
  const post: PostViewModel = postsRepository.createPost(data as PostViewModel);
  res.status(201).send(post);
};

export const getPostByIdController = (req: Request, res: Response) => {
  const id = req.params.id;
  const post: PostViewModel | null = postsRepository.findPostById(id);
  post ? res.status(200).send(post) : res.sendStatus(404);
};

export const putPostByIdController = (req: Request, res: Response) => {
  const id = req.params.id;
  const data = matchedData(req);
  const updatedPost = postsRepository.updatePost(id, data as PostViewModel);
  updatedPost ? res.sendStatus(204) : res.sendStatus(404);
};

export const deletePostByIdController = (req: Request, res: Response) => {
  const id = req.params.id;
  const isDeleted = postsRepository.deletePost(id);
  isDeleted ? res.sendStatus(204) : res.sendStatus(404);
};
