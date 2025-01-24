import { NextFunction, Request, Response } from "express";

import { authService } from "../auth/auth-service";
import { APIDTO } from "../types/APIDTO.type";
import { AccessPayloadInterface } from "../types/tokens/AccessPayload.interface";
import { UserDBModel } from "../types/users/UserDBModel.type";

export const tokenAuthorizationMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authorization = req.headers["authorization"];
  if (authorization) {
    const [type, token] = authorization.split(" ");
    if (type === "Bearer" && token) {
      const resultOfVerification: APIDTO<{
        user: UserDBModel;
        payload: AccessPayloadInterface;
      } | null> = await authService.verifyAccessToken(token);
      if (!resultOfVerification.isError) {
        res.locals.user = resultOfVerification.data?.user;
        next();
        return;
      }
    }
  }
  res.sendStatus(401);
};
