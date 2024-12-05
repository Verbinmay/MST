import { Request, Response } from "express";
import { matchedData } from "express-validator";

import { PostViewModel } from "../types/posts/PostViewModel.type";
import { postsMapper } from "./posts-mapper";

export const getPostsController = async (req: Request, res: Response) => {
  const posts: Array<PostViewModel> = await postsMapper.findPosts();
  res.status(200).send(posts);
};

export const postPostController = async (req: Request, res: Response) => {
  const data = matchedData(req);
  const post: PostViewModel | null = await postsMapper.createPost(
    data as PostViewModel
  );
  post ? res.status(201).send(post) : res.sendStatus(400);
};

export const getPostByIdController = async (req: Request, res: Response) => {
  const id = req.params.id;
  const post: PostViewModel | null = await postsMapper.findPostById(id);
  post ? res.status(200).send(post) : res.sendStatus(404);
};

export const putPostByIdController = async (req: Request, res: Response) => {
  const id = req.params.id;
  const data = matchedData(req);
  const isUpdated: boolean = await postsMapper.updatePost(
    id,
    data as PostViewModel
  );
  isUpdated ? res.sendStatus(204) : res.sendStatus(404);
};

export const deletePostByIdController = async (req: Request, res: Response) => {
  const id = req.params.id;
  const isDeleted: boolean = await postsMapper.deletePost(id);
  isDeleted ? res.sendStatus(204) : res.sendStatus(404);
};
