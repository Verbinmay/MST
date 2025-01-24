import { Router } from "express";

import { securityController } from "../securityDevices/security-controller";
import { tokenAuthorizationMiddleware } from "../validation/token-authorization-middleware";

export const securityRouter = Router();

securityRouter.get(
  "/devices",
  tokenAuthorizationMiddleware,
  securityController
);
