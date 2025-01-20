import { Request, Response } from "express";
import { matchedData } from "express-validator";

import { viewModelCreator } from "../helpers/viewModelCreator";
import { LoginInputModel } from "../types/auth/LoginInputModel.type";
import { UserDBModel } from "../types/users/UserDBModel.type";
import { usersService } from "../users/users-service";
import { authServices } from "./auth-service";

export const authController = async (req: Request, res: Response) => {
  const data = matchedData(req);
  const isUser: UserDBModel | null = await usersService.compareUserInfo(
    data as LoginInputModel
  );
  if (!isUser) {
    res.sendStatus(401);
    return;
  }

  const token: string = await authServices.createJWT(isUser);
  res.status(200).json({ token });
};

export const getMeController = async (req: Request, res: Response) => {
  const user = viewModelCreator.meViewModel(res.locals.user);
  res.status(200).send(user);
};
