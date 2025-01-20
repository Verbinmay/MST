import { NextFunction, Request, Response } from "express";

import { authServices } from "../auth/auth-service";

export const tokenAuthorizationMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authorization = req.headers["authorization"];
  if (authorization) {
    const [type, token] = authorization.split(" ");
    if (type === "Bearer" && token) {
      const user = await authServices.verifyJWT(token);
      if (user) {
        res.locals.user = user;
        next();
        return;
      }
    }
  }
  res.sendStatus(401);
};
