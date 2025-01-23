import { Request, Response } from "express";
import { matchedData } from "express-validator";

import { viewModelCreator } from "../helpers/viewModelCreator";
import { ConfirmationRegistrationInputModel } from "../types/auth/ConfimationRegistrationInputModel.type";
import { LoginInputModel } from "../types/auth/LoginInputModel.type";
import { UserDBModel } from "../types/users/UserDBModel.type";
import { UserInputModel } from "../types/users/UserInputModel.type";
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
  const accessToken: string = await authServices.createJWT(isUser, "10s");
  const refreshToken: string = await authServices.createJWT(isUser, "20s");
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
  });
  res.status(200).json({ accessToken });
};

export const getMeController = async (req: Request, res: Response) => {
  const user = viewModelCreator.meViewModel(res.locals.user);
  res.status(200).send(user);
};

export const registrationController = async (req: Request, res: Response) => {
  const data = matchedData(req);
  const user: UserDBModel | null = await authServices.registration(
    data as UserInputModel
  );
  if (!user) {
    res.sendStatus(500);
    return;
  }
  res.sendStatus(204);
};

export const registrationConfirmationController = async (
  req: Request,
  res: Response
) => {
  const data = matchedData(req);
  const isConfirmed: boolean = await authServices.confirmRegistration(
    data as ConfirmationRegistrationInputModel
  );
  if (!isConfirmed) {
    res.sendStatus(500);
    return;
  }
  res.sendStatus(204);
};

export const refreshTokensController = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  const tokens: {
    accessToken: string;
    refreshToken: string;
  } | null = await authServices.refreshTokens(refreshToken);
  if (!tokens) {
    res.sendStatus(401);
    return;
  }
  res.cookie("refreshToken", tokens.refreshToken, {
    httpOnly: true,
    secure: true,
  });
  res.status(200).json({ accessToken: tokens.accessToken });
};

export const logoutController = async (req: Request, res: Response) => {
  const addRefreshInBlock = await authServices.verifyRefreshTokenAndAddInBlock(
    req.cookies.refreshToken
  );
  if (!addRefreshInBlock) {
    res.sendStatus(401);
    return;
  }
  res.clearCookie("refreshToken");
  res.sendStatus(204);
};
