import { Request, Response } from "express";
import { matchedData } from "express-validator";

import { PaginationInputModel } from "../types/PaginationInputModel.type";
import { UserInputModel } from "../types/users/UserInputModel.type";
import { UserViewModel } from "../types/users/UserViewModel.type";
import { usersMapper } from "./users-mapper";

export const getUsersController = async (req: Request, res: Response) => {
  const pagData: PaginationInputModel = req.body._pagination;
  const users = await usersMapper.findUsers(pagData);
  res.status(200).json(users);
};

export const postUserController = async (req: Request, res: Response) => {
  const data = matchedData(req);
  const user: UserViewModel | null = await usersMapper.createUserLikeAdmin(
    data as UserInputModel
  );
  user ? res.status(201).json(user) : res.sendStatus(400);
};

export const deleteUserByIdController = async (req: Request, res: Response) => {
  const id = req.params.id;
  const isDeleted: boolean = await usersMapper.deleteUser(id);
  isDeleted ? res.sendStatus(204) : res.sendStatus(404);
};
