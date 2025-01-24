import { randomUUID } from "crypto";
import { Request, Response } from "express";
import { matchedData } from "express-validator";

import { readAPIDTO } from "../helpers/readAPIDTO";
import { viewModelCreator } from "../helpers/viewModelCreator";
import { sessionsService } from "../sessions/sessions-service";
import { ConfirmationRegistrationInputModel } from "../types/auth/ConfimationRegistrationInputModel.type";
import { LoginInputModel } from "../types/auth/LoginInputModel.type";
import { RefreshPayloadInterface } from "../types/tokens/RefreshPayload.interface copy";
import { UserDBModel } from "../types/users/UserDBModel.type";
import { UserInputModel } from "../types/users/UserInputModel.type";
import { usersService } from "../users/users-service";
import { authService } from "./auth-service";

export const authController = async (req: Request, res: Response) => {
  try {
    const data = matchedData(req);
    const isUser: UserDBModel | null = await usersService.compareUserInfo(
      data as LoginInputModel
    );
    if (!isUser) {
      res.sendStatus(401);
      return;
    }

    const deviceName = req.headers["user-agent"] ?? "SMTH";
    const deviceId = randomUUID();

    const { accessToken, refreshToken } = readAPIDTO(
      await authService.makeAccessAndRefreshTokens(isUser._id, deviceId)
    ) as {
      accessToken: string;
      refreshToken: string;
    };

    const payload = readAPIDTO(
      await authService.verifyJWT(refreshToken)
    ) as RefreshPayloadInterface;

    const isSessionCreated = readAPIDTO(
      await sessionsService.createSession({
        userId: isUser._id,
        deviceName,
        ip: req.ip ?? (req.headers["x-forwarded-for"] as string) ?? "not found",
        deviceId,
        iat: new Date(payload.iat! * 1000),
        exp: new Date(payload.exp! * 1000),
      })
    );

    if (!isSessionCreated) {
      res.sendStatus(500);
      return;
    }

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
    });
    res.status(200).json({ accessToken });
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
};

export const getMeController = async (req: Request, res: Response) => {
  try {
    const user = viewModelCreator.meViewModel(res.locals.user);
    res.status(200).send(user);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
};

export const registrationController = async (req: Request, res: Response) => {
  try {
    const data = matchedData(req);
    const resultOfRegistration: boolean = readAPIDTO(
      await authService.registration(data as UserInputModel)
    );

    if (!resultOfRegistration) {
      res.sendStatus(500);
      return;
    }
    res.sendStatus(204);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
};

export const registrationConfirmationController = async (
  req: Request,
  res: Response
) => {
  try {
    const data = matchedData(req);
    const isConfirmed: boolean = readAPIDTO(
      await authService.confirmRegistration(
        data as ConfirmationRegistrationInputModel
      )
    );
    if (!isConfirmed) {
      res.sendStatus(500);
      return;
    }
    res.sendStatus(204);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
};

export const refreshTokensController = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    const tokens = readAPIDTO(
      await authService.refreshTokens(refreshToken)
    ) as {
      accessToken: string;
      refreshToken: string;
    };

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: true,
    });
    res.status(200).json({ accessToken: tokens.accessToken });
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
};

export const logoutController = async (req: Request, res: Response) => {
  try {
    const addRefreshInBlock: boolean = readAPIDTO(
      await authService.logout(req.cookies.refreshToken)
    );
    if (!addRefreshInBlock) {
      res.sendStatus(500);
      return;
    }

    res.clearCookie("refreshToken");
    res.sendStatus(204);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
};
